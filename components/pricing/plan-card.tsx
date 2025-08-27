import type { PlanInfo } from "@/lib/plans/types"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { spotlightVariant } from "@/components/animations/background"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PlanCardProps {
  plan: PlanInfo
  isHighlighted?: boolean
  onboardingFeature?: boolean
}

export function PlanCard({
  plan,
  isHighlighted = false,
  onboardingFeature = false
}: PlanCardProps) {
  return (
    <Card className={cn("relative", isHighlighted && "border-primary")}>
      {isHighlighted && (
        <>
          <Badge variant="primary" className="-top-4 -translate-x-1/2 absolute left-1/2">
            Most Popular
          </Badge>
          <motion.div
            className="-translate-x-1/2 absolute bottom-0 left-1/2 h-12 w-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(0, 219, 205, 0.9) 10%, rgba(0, 219, 205, 0.8) 80%, transparent 100%)"
            }}
            initial={{ opacity: 0 }}
            whileInView={spotlightVariant(0.75)}
            viewport={{ once: true }}
            aria-hidden="true"
          />
        </>
      )}

      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
        <CardDescription className="mt-4 flex items-baseline">
          <span className="font-bold text-4xl text-foreground">${plan.price}</span>
          <span className="ml-0.5 text-muted-foreground">/{plan.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <ul className="my-6 space-y-4 text-sm">
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary" />
            {plan.concurrentBots} Concurrent Bots
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary" />
            {plan.requestsPerSecond} Requests/Second
          </li>
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
          {onboardingFeature && (
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              <span>Free Recording for up to 4 hours when you sign up</span>
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={isHighlighted ? "default" : "outline"} className="z-20 w-full" asChild>
          <Link href={plan.redirectTo}>Get started {plan.price === "0" ? "for free" : ""}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
