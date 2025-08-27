import type { Content } from "@/lib/broadcast-types"
import type { EmailType } from "@/lib/email-types"
import { contentFormSchema, type ContentFormValues } from "@/lib/schemas/content"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { FormFields } from "@/components/broadcasts/content/form-fields"
import type { DialogState } from "@/components/broadcasts/content/table-actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useContents } from "@/hooks/use-contents"

interface EditContentProps {
  broadcastTypes: EmailType[]
  row: Content
  open: DialogState
  onOpenChange: (open: DialogState) => void
}

export function EditContent({ broadcastTypes, row, open, onOpenChange }: EditContentProps) {
  const { updateContent, isUpdatingContent: isLoading } = useContents()

  if (open !== "edit") {
    return null
  }

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      emailType: row.emailType,
      content: row.content,
      contentText: row.contentText
    }
  })

  const {
    formState: { isDirty }
  } = form

  const onSubmit = (data: ContentFormValues) => {
    if (isLoading) return

    updateContent(
      { id: row.id, content: data },
      {
        onSuccess: () => {
          form.reset()
          handleOpenChange(false)
        }
      }
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen ? "edit" : null)
  }
  return (
    <Dialog open={open === "edit"} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
          <DialogDescription className="sr-only">
            Edit the content for this content block
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="edit-content-form">
            <FormFields broadcastTypes={broadcastTypes} />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isLoading} aria-disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="edit-content-form"
            type="submit"
            disabled={isLoading || !isDirty}
            aria-disabled={isLoading || !isDirty}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Updating...
              </>
            ) : (
              "Update Content"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
