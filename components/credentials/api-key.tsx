"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ApiKeyProps {
  apiKey: string
}

export function ApiKey({ apiKey }: ApiKeyProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Error copying API key to clipboard", err)
      toast.error("Failed to copy API key. Please try again.")
    }
  }

  return (
    <div>
      <Label htmlFor="api-key" className="mb-2 font-medium">
        Your API Key:
      </Label>
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          readOnly
          className="pr-20"
          id="api-key"
        />
        <div className="-translate-y-1/2 absolute top-1/2 right-0 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide API key" : "Show API key"}
          >
            {isVisible ? <EyeOff /> : <Eye />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyToClipboard}
            aria-label={isCopied ? "Copied to clipboard" : "Copy API key to clipboard"}
          >
            {isCopied ? <Check className="stroke-primary" /> : <Copy />}
          </Button>
        </div>
      </div>
    </div>
  )
}
