import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageTitleProps {
  title: string
  description: string
}

export const PageTitle = ({ title, description }: PageTitleProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="block px-1 md:hidden" />
        <h1 className="font-bold text-3xl">{title}</h1>
      </div>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  )
}
