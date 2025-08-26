import { spotlightVariant } from "@/animations/background"
import { Cards } from "@/components/home/cards"
import { Contributing } from "@/components/home/contributing"
import * as motion from "motion/react-client"

interface HomeProps {
    noBotsSent: boolean
    chatId: string | null
}

export default function Home({ noBotsSent, chatId }: HomeProps) {
    return (
        <main className="container mx-auto flex flex-col gap-20 px-6 lg:px-0">
            <motion.div
                className="-z-10 -translate-x-1/2 absolute top-0 left-1/2 h-[120px] w-3/5 rounded-full blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle, rgba(0, 219, 205, 0.9) 10%, rgba(0, 219, 205, 0.8) 80%, transparent 100%)"
                }}
                initial={{ opacity: 0 }}
                animate={spotlightVariant}
                aria-hidden="true"
            />
            <section>
                <Cards noBotsSent={noBotsSent} chatId={chatId} />
            </section>
            <section>
                <Contributing />
            </section>
        </main>
    )
}
