import Papa from "papaparse"
import { csvRowsSchema, type CsvRows } from "@/lib/schemas/recipients"
import type { RecipientWithStatus } from "@/lib/broadcast-types"

interface PapaParseResult {
  data: Record<string, string>[]
  meta: {
    fields?: string[]
  }
}

const CSV_HEADERS = ["email", "firstname", "lastname", "status"]

export const parseCsv = async (file: File): Promise<Map<string, CsvRows[number]>> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().trim(),
      complete: (results: PapaParseResult) => {
        try {
          // Validate headers
          const missingHeaders = CSV_HEADERS.filter((h) => !results.meta.fields?.includes(h))
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`)
          }

          // Validate data
          const parsedData = csvRowsSchema.safeParse(results.data)
          if (!parsedData.success) {
            console.error("Invalid data", parsedData.error)
            throw new Error("Invalid data found in CSV file")
          }

          // Return a map of email to row object for fast lookup
          const emailMap = new Map(parsedData.data.map((row) => [row.email, row]))
          resolve(emailMap)
        } catch (error) {
          reject(error)
        }
      },
      error: (error: Error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`))
      }
    })
  })
}

interface DownloadCsvProps {
  recipientStatuses: RecipientWithStatus[]
  broadcastId: string
  filename?: string
}

export const downloadCsv = ({ recipientStatuses, broadcastId, filename }: DownloadCsvProps) => {
  // Sort recipients by status (sent first, then error, then skipped)
  const sortedStatuses = [...recipientStatuses].sort((a, b) => {
    const statusOrder = { sent: 0, error: 1, skipped: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  const csv = Papa.unparse(sortedStatuses, {
    header: true,
    columns: ["email", "firstname", "lastname", "status"]
  })

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename ?? createFileName(broadcastId)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export const createFileName = (broadcastId: string) => {
  return `campaign-${broadcastId}-${Date.now()}.csv`
}
