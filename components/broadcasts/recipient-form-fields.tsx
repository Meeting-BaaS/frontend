import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface RecipientFormFieldsProps {
  csvError: string | null
  csvParsing: boolean
}

export function RecipientFormFields({ csvError, csvParsing }: RecipientFormFieldsProps) {
  const { control } = useFormContext()

  return (
    <>
      <FormField
        control={control}
        name="maxRecipients"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Recipients</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter number of recipients (e.g., 100)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="csvFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Upload CSV (Optional){" "}
              {csvParsing && <Loader2 className="size-2 animate-spin stroke-primary" />}
            </FormLabel>
            <FormControl className="relative">
              <Input
                type="file"
                accept=".csv"
                multiple={false}
                name={field.name}
                ref={field.ref}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  field.onChange(file)
                }}
              />
            </FormControl>
            {csvError && <p className="text-destructive text-sm">{csvError}</p>}
            <FormMessage />
            <FormDescription>
              Upload a CSV file to send the broadcast to recipients who were skipped or failed
              previously.
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  )
}
