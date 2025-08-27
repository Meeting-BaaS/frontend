/** biome-ignore-all lint/style/useDefaultParameterLast: TODO: We will fix all the lint issues in this file in a future PR */
/** biome-ignore-all lint/complexity/useOptionalChain: TODO: We will fix all the lint issues in this file in a future PR */
/** biome-ignore-all lint/suspicious/noExplicitAny: TODO: We will fix all the lint issues in this file in a future PR */

import { GitHubLogo } from "@repo/shared/components/icons/github"
import { Button } from "@repo/shared/components/ui/button"
import { Card, CardContent } from "@repo/shared/components/ui/card"
import { Check, Copy, Globe, Key } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Prism from "react-syntax-highlighter/dist/esm/prism"
import { vs, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { toast } from "sonner"
import type { McpServerSpec } from "@/lib/mcp-specs"
import { getConfigJson } from "@/lib/utils"

interface McpCardProps {
  server: McpServerSpec
  theme?: string
  apiKey?: string
}

// Recursively inject envVars into localConfig where referenced by key
function injectEnvVarsToLocalConfig(
  localConfig: any,
  envVars: any[] = [],
  apiKey: string | undefined
) {
  const config = JSON.parse(JSON.stringify(localConfig))
  function inject(obj: any) {
    if (typeof obj !== "object" || obj === null) return
    for (const key of Object.keys(obj)) {
      // Always inject API key or placeholder for sensitive keys
      if (key === "x-meeting-baas-api-key" || key === "x-api-key") {
        obj[key] = apiKey || "YOUR_API_KEY_HERE"
      }
      // Always inject envVar value if present
      const envVar = envVars.find((v) => v.label === key)
      if (envVar && !(key === "x-meeting-baas-api-key" || key === "x-api-key")) {
        obj[key] = envVar.value
      }
      inject(obj[key])
    }
  }
  inject(config)
  return config
}

// Recursively mask all sensitive values, including API key fields
function maskSensitiveLocalConfig(
  localConfig: any,
  envVars: any[] = [],
  reveal = false,
  apiKey?: string
) {
  const config = JSON.parse(JSON.stringify(localConfig))
  function mask(obj: any) {
    if (typeof obj !== "object" || obj === null) return
    for (const key of Object.keys(obj)) {
      // Always treat API key fields as sensitive
      if (key === "x-meeting-baas-api-key" || key === "x-api-key") {
        if (reveal) {
          obj[key] = apiKey || "YOUR_API_KEY_HERE"
        } else {
          obj[key] = "********"
        }
      } else {
        // Mask envVars if sensitive
        const envVar = envVars.find((v) => v.label === key)
        if (envVar && envVar.sensitive) {
          if (reveal) {
            obj[key] = envVar.value
          } else {
            obj[key] = "********"
          }
        }
      }
      mask(obj[key])
    }
  }
  mask(config)
  return config
}

export const McpCard = ({ server, theme, apiKey }: McpCardProps) => {
  // Merge 'Use my API key' and 'Show sensitive values' into one toggle
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  // For localConfig, inject envVars and mask sensitive values
  let configJson: string
  if (server.localConfig) {
    let config = injectEnvVarsToLocalConfig(
      server.localConfig,
      server.envVars,
      revealed ? apiKey : undefined
    )
    config = maskSensitiveLocalConfig(
      config,
      server.envVars,
      revealed,
      revealed ? apiKey : undefined
    )
    configJson = JSON.stringify(config, null, 2)
  } else {
    // For envVars, inject API key if revealed, and mask sensitive values
    configJson = getConfigJson(server, revealed, revealed ? apiKey : undefined)
  }

  const handleCopy = async () => {
    try {
      // Copy config as currently shown
      let toCopy: string
      if (server.localConfig) {
        let config = injectEnvVarsToLocalConfig(
          server.localConfig,
          server.envVars,
          revealed ? apiKey : undefined
        )
        config = maskSensitiveLocalConfig(
          config,
          server.envVars,
          revealed,
          revealed ? apiKey : undefined
        )
        toCopy = JSON.stringify(config, null, 2)
      } else {
        toCopy = getConfigJson(server, revealed, revealed ? apiKey : undefined)
      }
      await navigator.clipboard.writeText(toCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Error copying to clipboard", e)
      toast.error("Error copying to clipboard")
    }
  }

  // Show the merged button if there is a sensitive envVar or API key field
  const hasSensitive =
    (server.envVars &&
      server.envVars.some(
        (env) =>
          env.sensitive ||
          env.label === "x-meeting-baas-api-key" ||
          env.label === "x-api-key" ||
          env.label === "API_KEY"
      )) ||
    server.localConfig

  return (
    <Card className="group relative grow">
      <CardContent className="flex grow flex-col justify-between gap-2 pt-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-semibold text-xl">{server.displayName}</div>
          <div className="min-h-12 text-base text-neutral-500 leading-relaxed dark:text-neutral-400">
            {server.description}
          </div>
        </div>
        <div className="flex min-h-12 flex-col items-start justify-start gap-2">
          {server.serverUrl && (
            <Button variant="link" className="h-auto p-0 has-[>svg]:px-0" asChild>
              <Link href={server.serverUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="text-card-foreground" />
                Server URL
              </Link>
            </Button>
          )}
          <Button variant="link" className="h-auto p-0 has-[>svg]:px-0" asChild>
            <Link href={server.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubLogo className="fill-card-foreground" />
              GitHub
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-end gap-2">
          {/* Merged button for API key injection and reveal/hide sensitive values */}
          {hasSensitive && (
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1.5"
              onClick={() => setRevealed((r) => !r)}
            >
              <Key className={revealed ? "stroke-primary" : ""} />
              {revealed ? "Hide sensitive values" : "Show sensitive values"}
            </Button>
          )}
        </div>
        <div className="relative flex grow">
          <Prism
            language="json"
            style={theme === "dark" ? vscDarkPlus : vs}
            wrapLines
            wrapLongLines
            customStyle={{
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              flexGrow: 1
            }}
            codeTagProps={{
              style: {
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                display: "block"
              }
            }}
          >
            {configJson}
          </Prism>
          <Button
            variant="ghost"
            size="icon"
            className="pointer-touch-opacity-100 absolute top-2 right-0 opacity-0 transition-opacity focus-within:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy JSON config"}
          >
            {copied ? <Check className="stroke-primary" /> : <Copy />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
