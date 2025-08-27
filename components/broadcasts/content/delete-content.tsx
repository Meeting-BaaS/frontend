import type { Content } from "@/lib/broadcast-types"
import type { DialogState } from "@/components/broadcasts/content/table-actions"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useContents } from "@/hooks/use-contents"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

interface DeleteContentProps {
  row: Content
  open: DialogState
  onOpenChange: (open: DialogState) => void
}

export function DeleteContent({ row, open, onOpenChange }: DeleteContentProps) {
  const { deleteContent, isDeletingContent: isLoading } = useContents()

  if (open !== "delete") {
    return null
  }

  const onDelete = () => {
    if (isLoading) return

    deleteContent(
      { id: row.id },
      {
        onSuccess: () => {
          handleOpenChange(false)
        }
      }
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen ? "delete" : null)
  }
  return (
    <AlertDialog open={open === "delete"} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the content and remove it
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} aria-disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={onDelete}
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-busy={isLoading}
            className="bg-baas-destructive text-white hover:bg-baas-destructive/90 focus-visible:ring-baas-destructive/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
