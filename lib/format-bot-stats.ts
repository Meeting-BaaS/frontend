import type {
  ErrorDistribution,
  ErrorTableEntry,
  ErrorPriority,
  FormattedBotData,
  NormalizedErrorGroup,
  PlatformDistribution,
  PlatformName,
  WebhookErrorGroup,
  TimelineEntry,
  DurationTimelineEntry,
  PlatformDurationEntry,
  DurationDistributionEntry,
  IssueReportData
} from "@/lib/types"
import { map, groupBy, sumBy } from "lodash-es"
import { allErrorCategories } from "@/lib/filter-options"
import {
  extractStalledHours,
  extractWebhookStatus,
  getErrorPlatformDistribution,
  getPriorityForError,
  getStalledErrorType,
  getUniqueDates,
  getUniquePriorities,
  getBotsWithDuration
} from "@/lib/utils"
import dayjs from "dayjs"

type Dictionary<T> = { [key: string]: T }

export const getPlatformFromUrl = (url: string): PlatformName => {
  if (url.includes("zoom.us")) return "zoom"
  if (url.includes("teams.microsoft.com") || url.includes("teams.live.com")) return "teams"
  if (url.includes("meet.google.com")) return "google meet"
  return "unknown"
}

const platformOrder: Record<PlatformName, number> = {
  "google meet": 0,
  teams: 1,
  zoom: 2,
  unknown: 3
}

/**
 * Filter and group error and warning bots by status value
 * @param formattedBots - The formatted bots
 * @returns The error distribution and error bots
 */
export const filterAndGroupErrorBots = (
  formattedBots: FormattedBotData[]
): { errorDistribution: Dictionary<FormattedBotData[]>; errorBots: FormattedBotData[] } => {
  // Get bots with errors and warnings
  const errorBots = formattedBots.filter((bot) => ["error", "warning"].includes(bot.status.type))

  // Group bots by status value
  const errorDistribution = groupBy(errorBots, "status.value")
  return { errorDistribution, errorBots }
}

/**
 * Get the platform distribution of bots
 * @param formattedBots - The formatted bots
 * @returns The platform distribution of bots
 */
export const getPlatformDistribution = (
  formattedBots: FormattedBotData[]
): PlatformDistribution[] => {
  // Group bots by platform
  const distribution = groupBy(formattedBots, "platform")

  const platformDistribution: PlatformDistribution[] = Object.entries(distribution).map(
    ([key, bots]) => {
      const successCount = bots.filter((bot) => bot.status.type.toLowerCase() === "success").length
      const errorCount = bots.filter((bot) => bot.status.type.toLowerCase() === "error").length
      const warningCount = bots.filter((bot) => bot.status.type.toLowerCase() === "warning").length
      const pendingCount = bots.filter((bot) => bot.status.type.toLowerCase() === "pending").length

      return {
        platform: key as PlatformName,
        count: bots.length,
        percentage: (bots.length / formattedBots.length) * 100,
        statusDistribution: {
          success: {
            count: successCount,
            percentage: (successCount / bots.length) * 100
          },
          error: {
            count: errorCount,
            percentage: (errorCount / bots.length) * 100
          },
          warning: {
            count: warningCount,
            percentage: (warningCount / bots.length) * 100
          },
          pending: {
            count: pendingCount,
            percentage: (pendingCount / bots.length) * 100
          }
        }
      }
    }
  )

  return platformDistribution.sort((a, b) => {
    const orderA = platformOrder[a.platform] ?? 999
    const orderB = platformOrder[b.platform] ?? 999
    return orderA - orderB
  })
}

/**
 * Get the error distribution of bots
 * @param errorDistribution - Error bots grouped by status value
 * @param errorBots - The bots with errors
 * @returns The error distribution of bots
 */
export const getErrorDistribution = (
  errorDistribution: Dictionary<FormattedBotData[]>,
  errorBots: FormattedBotData[]
): ErrorDistribution[] => {
  // Map the error distribution to an array of objects with name, value, and percentage
  const errorDistributionData = map(errorDistribution, (bots, value) => ({
    name: value,
    value: bots.length,
    percentage: (bots.length / errorBots.length) * 100
  }))
  return errorDistributionData
}

/**
 * Process webhook errors and group them by status code
 * @param bots - Array of bots with webhook errors
 * @returns Array of normalized error groups for webhook errors
 */
function processWebhookErrors(bots: FormattedBotData[]): NormalizedErrorGroup[] {
  // Initialize groups with an "other" category for unclassified errors
  const webhookGroups: Record<string, WebhookErrorGroup> = {
    other: { count: 0, messages: [], bots: [] }
  }

  // Group bots by their status code
  for (const bot of bots) {
    const statusCode = extractWebhookStatus(bot.status.details)
    const groupKey = statusCode || "other"

    if (!webhookGroups[groupKey]) {
      webhookGroups[groupKey] = { count: 0, messages: [], bots: [] }
    }

    webhookGroups[groupKey].count++
    webhookGroups[groupKey].messages.push(bot.status.details || "")
    webhookGroups[groupKey].bots.push(bot)
  }

  // Convert groups to normalized format, filtering out empty groups
  return Object.entries(webhookGroups)
    .filter(([_, { count }]) => count > 0)
    .map(([statusCode, { messages, bots }]) => ({
      type: statusCode === "other" ? "Webhook Error (Other)" : `Webhook Error (${statusCode})`,
      message: statusCode === "other" ? messages[0] : `Status: ${statusCode} - ${messages[0]}`,
      bots
    }))
}

/**
 * Process stalled errors and group them by time ranges
 * @param bots - Array of bots with stalled errors
 * @returns Array of normalized error groups for stalled errors
 */
function processStalledErrors(bots: FormattedBotData[]): NormalizedErrorGroup[] {
  // Initialize groups for different time ranges
  const stalledGroups: Record<string, { values: number[]; bots: FormattedBotData[] }> = {
    under24h: { values: [], bots: [] },
    under48h: { values: [], bots: [] },
    over48h: { values: [], bots: [] }
  }

  // Group bots by their stalled time range
  for (const bot of bots) {
    const hours = extractStalledHours(bot.status.details)
    if (hours === null) continue

    if (hours < 24) {
      stalledGroups.under24h.values.push(hours)
      stalledGroups.under24h.bots.push(bot)
    } else if (hours < 48) {
      stalledGroups.under48h.values.push(hours)
      stalledGroups.under48h.bots.push(bot)
    } else {
      stalledGroups.over48h.values.push(hours)
      stalledGroups.over48h.bots.push(bot)
    }
  }

  // Convert groups to normalized format, filtering out empty groups
  return Object.entries(stalledGroups)
    .filter(([_, { values }]) => values.length > 0)
    .map(([_, { values, bots }]) => {
      const avgHours = values.reduce((sum, hours) => sum + hours, 0) / values.length
      const formattedHours = avgHours.toFixed(1)
      const type = getStalledErrorType(avgHours)
      const message = `${values.length > 1 ? "Bots have" : "Bot has"} been pending for an average of ${formattedHours} hours`

      return { type, message, bots }
    })
}

/**
 * Process unknown errors and group them by their details
 * @param bots - Array of bots with unknown errors
 * @returns Array of normalized error groups for unknown errors
 */
function processUnknownErrors(bots: FormattedBotData[]): NormalizedErrorGroup[] {
  // Group bots by their error details
  const unknownGroups: Record<string, { messages: string[]; bots: FormattedBotData[] }> = {}

  // Group bots by their error details
  for (const bot of bots) {
    const details = bot.status.details || "Unknown error"
    if (!unknownGroups[details]) {
      unknownGroups[details] = { messages: [], bots: [] }
    }

    unknownGroups[details].messages.push(details)
    unknownGroups[details].bots.push(bot)
  }

  // Convert groups to normalized format
  return Object.entries(unknownGroups).map(([details, { messages, bots }]) => ({
    type: "Unknown Error",
    message: messages[0],
    bots
  }))
}

/**
 * Create an error table entry from a group of bots
 * @param group - Normalized error group
 * @param originalType - Original error type
 * @param category - Error category
 * @returns Formatted error table entry
 */
function createErrorTableEntry(
  group: NormalizedErrorGroup,
  originalType: string,
  category: string
): ErrorTableEntry {
  return {
    type: group.type,
    originalType,
    message: group.message,
    category:
      allErrorCategories.find((c) => c.value === category)?.label ||
      (category === "user_reported_error" ? "User Reported Error" : category), // Formatting for user reported errors
    priority: getPriorityForError(category) as ErrorPriority,
    platforms: getErrorPlatformDistribution(group.bots),
    count: group.bots.length,
    botUuids: group.bots.map((bot) => bot.uuid)
  }
}

/**
 * Get error table data from error distribution
 * @param errorDistribution - Dictionary of bots grouped by error type
 * @returns Array of formatted error table entries
 */
export function getErrorTable(
  errorDistribution: Dictionary<FormattedBotData[]>
): ErrorTableEntry[] {
  return Object.entries(errorDistribution).flatMap(([value, bots]) => {
    const { status } = bots[0]
    const category = status.category || "unknown_error"
    const details = status.details || `${category} error`

    // Process based on error category
    let normalizedGroups: NormalizedErrorGroup[]
    switch (category) {
      case "webhook_error":
        normalizedGroups = processWebhookErrors(bots)
        break
      case "stalled_error":
        normalizedGroups = processStalledErrors(bots)
        break
      case "unknown_error":
        normalizedGroups = processUnknownErrors(bots)
        break
      default:
        normalizedGroups = [{ type: value, message: details, bots }]
    }

    return normalizedGroups.map((group) => createErrorTableEntry(group, value, category))
  })
}

/**
 * Transform bot data into timeline entries showing error counts by priority
 */
export function getTimelineData(bots: FormattedBotData[]): TimelineEntry[] {
  // Get all unique dates and priorities
  const allDates = getUniqueDates(bots)
  const allPriorities = getUniquePriorities(bots)

  // Create a map of dates to error counts by priority
  const dateMap = new Map(
    allDates.map((date) => [
      date,
      allPriorities.reduce(
        (acc, priority) => {
          acc[priority] = 0
          return acc
        },
        {} as Record<string, number>
      )
    ])
  )

  // Fill in the actual counts
  const errorBots = bots.filter((bot) =>
    ["error", "warning"].includes(bot.status.type.toLowerCase())
  )

  for (const bot of errorBots) {
    const date = dayjs(bot.created_at).format("YYYY-MM-DD")
    const priority = getPriorityForError(bot.status.category || "unknown_error")
    const dateData = dateMap.get(date)
    if (dateData) {
      dateData[priority] = (dateData[priority] || 0) + 1
    }
  }

  // Convert to array format for the chart
  return Array.from(dateMap.entries()).map(([date, priorities]) => {
    const total = Object.values(priorities).reduce((sum, count) => sum + count, 0)
    return {
      date,
      total,
      priorities: Object.entries(priorities).map(([priority, count]) => ({
        priority,
        count
      }))
    }
  })
}

/**
 * Transform bot data into duration timeline entries
 */
export function getDurationTimelineData(bots: FormattedBotData[]): DurationTimelineEntry[] {
  // Group bots by date
  const botsByDate = groupBy(bots, (bot) => dayjs(bot.created_at).format("YYYY-MM-DD"))

  // Calculate metrics for each date
  return Object.entries(botsByDate)
    .map(([date, dateBots]) => {
      const botsWithDuration = getBotsWithDuration(dateBots)
      if (botsWithDuration.length === 0) return null

      const totalDuration = sumBy(botsWithDuration, "duration")
      const averageDuration = totalDuration / botsWithDuration.length

      return {
        date,
        averageDuration,
        totalDuration,
        botCount: botsWithDuration.length
      }
    })
    .filter((data): data is NonNullable<typeof data> => data !== null)
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
}

/**
 * Transform bot data into platform duration entries
 */
export function getPlatformDurationData(bots: FormattedBotData[]): PlatformDurationEntry[] {
  const botsWithDuration = getBotsWithDuration(bots)
  const platformGroups = groupBy(botsWithDuration, "platform")

  return Object.entries(platformGroups).map(([platform, platformBots]) => {
    const totalDuration = sumBy(platformBots, "duration")
    const averageDuration = totalDuration / platformBots.length

    return {
      name: platform,
      value: averageDuration,
      count: platformBots.length
    }
  })
}

/**
 * Transform bot data into duration distribution entries
 */
export function getDurationDistributionData(bots: FormattedBotData[]): DurationDistributionEntry[] {
  const botsWithDuration = getBotsWithDuration(bots)
  const ranges = [
    { min: 0, max: 15 * 60, label: "0-15m" },
    { min: 15 * 60, max: 30 * 60, label: "15-30m" },
    { min: 30 * 60, max: 45 * 60, label: "30-45m" },
    { min: 45 * 60, max: 60 * 60, label: "45-60m" },
    { min: 60 * 60, max: Number.POSITIVE_INFINITY, label: "60m+" }
  ]

  return ranges.map((range) => {
    const count = botsWithDuration.filter(
      (bot) => bot.duration >= range.min && bot.duration < range.max
    ).length

    return {
      range: range.label,
      count,
      percentage: (count / botsWithDuration.length) * 100
    }
  })
}

/**
 * Transform bot data into issue report data
 */
export function getIssueReportData(bots: FormattedBotData[]): IssueReportData {
  // Get all bots with user reported errors
  const botsWithUserReports = bots.filter(
    (bot) => bot.user_reported_error && typeof bot.user_reported_error === "object"
  )

  // Count by status
  const statusCounts = {
    open: 0,
    in_progress: 0,
    closed: 0
  }

  for (const bot of botsWithUserReports) {
    const report = bot.user_reported_error
    const status = report.status?.toLowerCase() || "open"
    if (status in statusCounts) {
      statusCounts[status as keyof typeof statusCounts]++
    }
  }

  // Transform for timeline
  const timelineData = Object.entries(
    groupBy(botsWithUserReports, (bot) => dayjs(bot.created_at).format("YYYY-MM-DD"))
  )
    .map(([date, bots]) => {
      const counts = {
        open: 0,
        in_progress: 0,
        closed: 0
      }

      for (const bot of bots) {
        const report = bot.user_reported_error
        const status = report.status?.toLowerCase() || "open"
        if (status in counts) {
          counts[status as keyof typeof counts]++
        }
      }

      return {
        date,
        ...counts
      }
    })
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())

  return {
    statusCounts,
    timelineData
  }
}

/**
 * If a bot has a user_reported_error with status 'open', update its status to reflect a user reported error.
 * @param bot - The bot object
 * @returns The bot object, with an updated status if it has an open user reported error
 */
export function applyUserReportedErrorStatus(bot: FormattedBotData): FormattedBotData {
  if (
    bot.user_reported_error &&
    typeof bot.user_reported_error === "object" &&
    bot.user_reported_error.status === "open"
  ) {
    return {
      ...bot,
      status: {
        value: "User Reported Error",
        type: "error",
        details: "Error has been reported by the user",
        sort_priority: 0,
        category: "user_reported_error"
      }
    }
  }
  return bot
}
