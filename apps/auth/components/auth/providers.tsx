import { GitHubLogo } from "@repo/shared/components/icons/github"
import { GoogleLogo } from "@/components/icons/google"
import { MicrosoftLogo } from "@/components/icons/microsoft"
// import { GitLabLogo } from "@/components/icons/gitlab"
// import { ZoomLogo } from "@/components/icons/zoom"

export type ProviderName = "google" | "microsoft" | "github" | "gitlab" | "zoom"

interface Provider {
  name: ProviderName
  title: string
  logo: React.ReactNode
  primary?: boolean
  className?: string
}

// Temporarily commenting provider buttons until they are configured in higher environments
export const providers: Provider[] = [
  {
    name: "microsoft",
    title: "Microsoft",
    logo: <MicrosoftLogo />,
    className: "hover:bg-microsoft-grey"
  },
  {
    name: "google",
    title: "Google",
    logo: <GoogleLogo />,
    className: "hover:bg-google-blue"
  },
  {
    name: "github",
    title: "GitHub",
    logo: <GitHubLogo />,
    className: "hover:bg-github-green"
  }
  // {
  //     name: "gitlab",
  //     title: "GitLab",
  //     logo: <GitLabLogo />,
  //     className: "hover:bg-gitlab-orange"
  // },
  // {
  //     name: "zoom",
  //     title: "Zoom",
  //     logo: <ZoomLogo />,
  //     className: "hover:bg-zoom-blue"
  // }
]
