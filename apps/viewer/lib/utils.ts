import type { PlatformName } from "@/types/meeting-data"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPlatformFromUrl = (url: string): PlatformName => {
  if (url.includes("zoom.us")) return "zoom"
  if (url.includes("teams.microsoft.com") || url.includes("teams.live.com")) return "teams"
  if (url.includes("meet.google.com")) return "google meet"
  return "unknown"
}
