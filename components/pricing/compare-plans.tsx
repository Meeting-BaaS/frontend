"use client"

import { planComparisonFeatures } from "@/lib/plans/constants"
import { Button } from "@/components/ui/button"
import { CircleCheck, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { PlanInfo } from "@/lib/plans/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ComparePlansProps {
  plans: PlanInfo[]
  isBillingPage?: boolean
}

export function ComparePlans({ plans, isBillingPage }: ComparePlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo>(plans[0])

  return (
    <div className="relative">
      <div
        className={cn(
          "top-[3.05rem] right-0 left-0 z-30 grid grid-cols-4 border-b bg-background lg:top-[3.6rem] lg:grid-cols-5",
          !isBillingPage && "sticky py-4"
        )}
      >
        <div className="p-4 lg:col-span-2 lg:p-6" />
        {/* Mobile Select */}
        <div className="col-span-4 mb-2 block lg:hidden">
          <Select
            name="selected-plan"
            value={selectedPlan.type}
            onValueChange={(value) => {
              const plan = plans.find((p) => p.type === value)
              if (plan) setSelectedPlan(plan)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((plan) => (
                <SelectItem key={plan.type} value={plan.type}>
                  {plan.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Desktop Plan Headers */}
        {plans.map((plan) => (
          <div
            key={plan.type}
            className="hidden flex-col items-center justify-center p-4 lg:flex lg:p-6"
          >
            <h3 className="font-semibold text-lg">{plan.title}</h3>
            {!isBillingPage && (
              <Button
                variant={plan.type === "ScaleAPI" ? "default" : "outline"}
                size="sm"
                className="mt-4"
                asChild
              >
                <Link href={plan.redirectTo}>
                  Get started {plan.price === "0" ? "for free" : ""}
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="divide-y">
        {planComparisonFeatures.map((feature) => (
          <div key={feature.name} className="grid grid-cols-4 lg:grid-cols-5">
            <div className="col-span-3 flex items-center gap-2 p-4 md:col-span-2 lg:p-6">
              <span className="font-medium">{feature.name}</span>
              {feature.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-4 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{feature.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {/* Mobile: Show only selected plan */}
            <div className="flex items-center justify-end p-4 lg:hidden">
              {feature.supportedIn.includes(selectedPlan.type) ? (
                <CircleCheck className="size-7 rounded-full bg-primary/10 p-1 text-primary" />
              ) : (
                <span className="px-2 text-muted-foreground">-</span>
              )}
            </div>
            {/* Desktop: Show all plans */}
            {plans.map((plan) => (
              <div
                key={`${feature.name}-${plan.type}`}
                className="hidden items-center justify-center p-4 lg:flex lg:p-6"
              >
                {feature.supportedIn.includes(plan.type) ? (
                  <CircleCheck className="size-7 rounded-full bg-primary/10 p-1 text-primary" />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Metrics */}
        <div className="grid grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex items-center gap-2 p-4 md:col-span-2 lg:p-6">
            <span className="font-medium">Concurrent Bots</span>
          </div>
          {/* Mobile: Show only selected plan */}
          <div className="col-span-2 flex items-center justify-end p-4 lg:hidden">
            <span className="font-medium text-muted-foreground">
              {selectedPlan.concurrentBots} concurrent bots
            </span>
          </div>
          {/* Desktop: Show all plans */}
          {plans.map((plan) => (
            <div
              key={`concurrent-bots-${plan.type}`}
              className="hidden items-center justify-center p-4 lg:flex lg:p-6"
            >
              <span className="font-medium text-muted-foreground">
                {plan.concurrentBots} concurrent bots
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex items-center gap-2 p-4 md:col-span-2 lg:p-6">
            <span className="font-medium">Requests/Second</span>
          </div>
          {/* Mobile: Show only selected plan */}
          <div className="col-span-2 flex items-center justify-end p-4 lg:hidden">
            <span className="font-thin text-muted-foreground">
              {selectedPlan.requestsPerSecond} requests/second
            </span>
          </div>
          {/* Desktop: Show all plans */}
          {plans.map((plan) => (
            <div
              key={`requests-per-second-${plan.type}`}
              className="hidden items-center justify-center p-4 lg:flex lg:p-6"
            >
              <span className="font-thin text-muted-foreground">
                {plan.requestsPerSecond} requests/second
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
