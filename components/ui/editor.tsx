"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Link as LinkIcon,
  Heading3
} from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { useFormField } from "@/components/ui/form"
import { useFormContext } from "react-hook-form"

interface EditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Editor({ value, onChange, className }: EditorProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  const { setValue, trigger, formState: {isSubmitted} } = useFormContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const isFirstRender = useRef(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Link.configure({
        openOnClick: false
      })
    ],
    content: value,
    onCreate: () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 200)
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
      const contentText = editor.getText()
      setValue("contentText", contentText)
      if (isSubmitted) {
        trigger("content")
      }
    },
    immediatelyRender: false
  })

  useEffect(() => {
    // Only set the content on the first render. onUpdate will handle updates.
    if (isFirstRender.current) {
      editor?.commands.setContent(value)
      isFirstRender.current = false
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setIsLinkDialogOpen(false)
    }
  }

  if (isLoading) {
    return <Skeleton className={cn("h-full w-full", className)} />
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border bg-transparent shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
    >
      <div className="flex flex-wrap gap-1 border-b p-1">
        <ToggleGroup type="multiple" className="flex-wrap">
          <ToggleGroupItem
            value="bold"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-state={editor.isActive("bold") ? "on" : "off"}
            type="button"
          >
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-state={editor.isActive("italic") ? "on" : "off"}
            type="button"
          >
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            data-state={editor.isActive("underline") ? "on" : "off"}
            type="button"
          >
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="mx-2 h-full" />

        <ToggleGroup type="single" className="flex-wrap">
          <ToggleGroupItem
            value="h3"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            data-state={editor.isActive("heading", { level: 3 }) ? "on" : "off"}
            type="button"
          >
            <Heading3 />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="mx-2 h-full" />

        <ToggleGroup type="single" className="flex-wrap">
          <ToggleGroupItem
            value="bullet"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-state={editor.isActive("bulletList") ? "on" : "off"}
            type="button"
          >
            <List />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="ordered"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            data-state={editor.isActive("orderedList") ? "on" : "off"}
            type="button"
          >
            <ListOrdered />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="mx-2 h-full" />

        <ToggleGroup type="single" className="flex-wrap">
          <ToggleGroupItem
            value="left"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            data-state={editor.isActive({ textAlign: "left" }) ? "on" : "off"}
            type="button"
          >
            <AlignLeft />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="center"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            data-state={editor.isActive({ textAlign: "center" }) ? "on" : "off"}
            type="button"
          >
            <AlignCenter />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="right"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            data-state={editor.isActive({ textAlign: "right" }) ? "on" : "off"}
            type="button"
          >
            <AlignRight />
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="mx-2 h-full" />

        <ToggleGroup type="single" className="flex-wrap">
          <ToggleGroupItem
            value="code"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            data-state={editor.isActive("codeBlock") ? "on" : "off"}
            type="button"
          >
            <Code />
          </ToggleGroupItem>
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <ToggleGroupItem
                value="link"
                size="sm"
                data-state={editor.isActive("link") ? "on" : "off"}
                type="button"
              >
                  <LinkIcon />
              </ToggleGroupItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Link</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleLinkSubmit} className="space-y-4">
                <Input
                  type="url"
                  placeholder="Enter URL"
                  value={linkUrl}
                  required
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLinkDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add Link</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </ToggleGroup>
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          "p-4 max-h-[400px] overflow-y-auto",
          "[&_.ProseMirror]:min-h-[160px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-foreground",
          "[&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h4]:text-lg [&_.ProseMirror_h5]:text-base [&_.ProseMirror_h6]:text-sm",
          "[&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6",
          "[&_.ProseMirror_ol]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6",
          "[&_.ProseMirror_blockquote]:mt-2 [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic",
          "[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono",
          "[&_.ProseMirror_pre]:mt-2 [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-sm",
          "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-4 [&_.ProseMirror_a]:hover:text-primary/80"
        )}
      />
    </div>
  )
}
