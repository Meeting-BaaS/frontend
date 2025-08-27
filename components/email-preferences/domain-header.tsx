"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { DomainConfig } from "@/lib/email-types"
import { cn } from "@/lib/utils"

interface DomainHeaderProps {
  config: DomainConfig
  className?: string
}

export const DomainHeader = ({ config, className }: DomainHeaderProps) => {
  return (
    <Card
      className={cn(
        "mb-6 dark:bg-[linear-gradient(238deg,#161616,hsla(0,0%,9%,0))] dark:bg-baas-black",
        className
      )}
    >
      <CardContent>
        <h3 className="mb-1 flex items-center justify-center gap-2 font-medium text-lg sm:justify-start">
          <div className={cn("size-3 rounded-full", config.color)} />
          {config.name}
        </h3>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Badge variant="outline" className={config.badge}>
            {config.domain}
          </Badge>
          <p className="text-muted-foreground text-sm">{config.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
