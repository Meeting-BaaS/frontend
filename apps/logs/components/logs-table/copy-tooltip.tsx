"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/shared/components/ui/tooltip"
import { cn } from "@repo/shared/lib/utils"
import { useState } from "react"
import { toast } from "sonner"

interface CopyTooltipProps {
  text: string
  className?: string
  children: React.ReactNode
  copyText?: string
}

export const CopyTooltip = ({ text, className, children, copyText }: CopyTooltipProps) => {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setIsOpen(true)
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 2000)
    } catch (err) {
      console.error("Tooltip copy error", err)
      toast.error("Failed to copy.")
    }
  }

  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleCopy}
          className={cn("cursor-pointer text-sm hover:opacity-80", className)}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{copied ? "Copied!" : copyText || "Click to copy"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
