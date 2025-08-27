"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contentFormSchema, type ContentFormValues } from "@/lib/schemas/content"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import type { EmailType } from "@/lib/email-types"
import { useState } from "react"
import { saveContent } from "@/lib/api/broadcast-api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { FormFields } from "@/components/broadcasts/content/form-fields"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

interface ContentFormProps {
  broadcastTypes: EmailType[]
}

export function ContentForm({ broadcastTypes }: ContentFormProps) {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      emailType: "",
      content: "",
      contentText: ""
    }
  })

  const onSubmit = async (data: ContentFormValues) => {
    setIsLoading(true)
    try {
      await saveContent(data)
      toast.success("Content saved successfully")
      queryClient.invalidateQueries({ queryKey: ["contents"] })
      router.push("/broadcasts/view")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save content")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFields broadcastTypes={broadcastTypes} />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Content"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
