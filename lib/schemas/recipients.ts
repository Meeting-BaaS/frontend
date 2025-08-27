import { z } from "zod"

export const FILE_SIZE_LIMIT = 2 * 1024 * 1024 // 2MB

export const csvFileSchema = z
  .instanceof(File)
  .nullable()
  .refine((val) => val === null || val.name.toLowerCase().endsWith(".csv"), {
    message: "File must be a CSV"
  })
  .refine((val) => val === null || val.size <= FILE_SIZE_LIMIT, {
    message: "File size must be less than 2MB"
  })

export const recipientFormSchema = z.object({
  maxRecipients: z
    .string()
    .min(1, "Please enter a number")
    .refine((val) => !Number.isNaN(Number(val)), {
      message: "Must be a number"
    })
    .refine((val) => Number(val) > 0, { message: "Must be greater than 0" }),
  csvFile: csvFileSchema
})

export type RecipientFormValues = z.infer<typeof recipientFormSchema>

export const csvRowsSchema = z.array(
  z.object({
    email: z.string().email("Invalid email address"),
    firstname: z.string().optional().default(""),
    lastname: z.string().optional().default(""),
    status: z.enum(["sent", "error", "skipped"], {
      errorMap: () => ({ message: "Status must be one of: sent, error, skipped" })
    })
  })
)

export type CsvRows = z.infer<typeof csvRowsSchema>
