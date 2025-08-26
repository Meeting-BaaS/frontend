import { cn } from "@/lib/utils"

export const MicrosoftLogo = ({ className, ...props }: React.ComponentProps<"svg">) => {
    return (
        <svg
            role="img"
            className={cn("fill-inherit", className)}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <title>Microsoft</title>
            <rect x="2" y="3" width="9" height="9" fill="#F25022" />
            <rect x="13" y="3" width="9" height="9" fill="#7FBA00" />
            <rect x="2" y="14" width="9" height="9" fill="#00A4EF" />
            <rect x="13" y="14" width="9" height="9" fill="#FFB900" />
        </svg>
    )
}
