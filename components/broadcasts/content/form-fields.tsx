import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Editor } from "@/components/ui/editor"
import type { EmailType } from "@/lib/email-types"
import { useFormContext } from "react-hook-form"

interface FormFieldsProps {
  broadcastTypes: EmailType[]
}

export function FormFields({ broadcastTypes }: FormFieldsProps) {
  const { control } = useFormContext()
  return (
    <>
      <FormField
        control={control}
        name="emailType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
                  <SelectValue placeholder="Select email type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {broadcastTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Editor value={field.value} onChange={field.onChange} className="min-h-[200px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
