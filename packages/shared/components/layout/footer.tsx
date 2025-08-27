import { Button } from "@repo/shared/components/ui/button"
import {
  MEETING_BAAS_HOMEPAGE_URL,
  PRIVACY_POLICY_URL,
  TERMS_AND_CONDITIONS_URL
} from "@repo/shared/lib/external-urls"
import Link from "next/link"

interface FooterProps {
  title: string
}

export default function Footer({ title }: FooterProps) {
  return (
    <footer className="border-t py-4 text-secondary-foreground">
      <div className="mx-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mx-8">
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs">
            Built by{" "}
            <Button variant="link" className="h-auto p-0 font-semibold" asChild>
              <Link href={MEETING_BAAS_HOMEPAGE_URL} rel="noopener noreferrer" target="_blank">
                Meeting BaaS
              </Link>
            </Button>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs sm:justify-end">
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href={TERMS_AND_CONDITIONS_URL} rel="noopener noreferrer" target="_blank">
              Terms & Conditions
            </Link>
          </Button>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
