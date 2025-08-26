import { Button } from "@/components/ui/button"
import { McpCard } from "@/components/home/mcp-card"
import { ChevronLeft } from "lucide-react"
import { mcpSpecs } from "@/lib/mcp-specs"
import { useTheme } from "next-themes"
import { useSession } from "@/hooks/use-session"
import { subCardsVariants } from "@/animations/card-transitions"
import { motion, useReducedMotion } from "motion/react"

interface McpSectionProps {
    goBack: () => void
}

export const McpSection = ({ goBack }: McpSectionProps) => {
    const { resolvedTheme } = useTheme()
    const { session } = useSession()
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.div
            key="mcp-cards"
            variants={subCardsVariants(shouldReduceMotion ?? false)}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mx-auto max-w-6xl"
        >
            <Button variant="ghost" className="mb-2" onClick={goBack}>
                <ChevronLeft /> Back
            </Button>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {mcpSpecs.map((server) => (
                    <McpCard
                        key={server.name}
                        server={server}
                        theme={resolvedTheme}
                        apiKey={session?.user.botsApiKey || ""}
                    />
                ))}
            </div>
        </motion.div>
    )
}
