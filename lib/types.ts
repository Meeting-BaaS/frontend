export type PlatformName = "zoom" | "teams" | "google meet" | "unknown"
export type StatusType = "success" | "error" | "pending" | "warning"
export type UserReportedErrorStatus = "open" | "closed" | "in_progress"

// Error categories from Rust implementation
export type ErrorCategory =
  | "system_error"
  | "auth_error"
  | "capacity_error"
  | "connection_error"
  | "permission_error"
  | "input_error"
  | "duplicate_error"
  | "webhook_error"
  | "api_error"
  | "user_reported_error"
  | "unknown_error"
  | "stalled_error"
  | "success"
  | "pending"

// Error priorities from Rust implementation
export type ErrorPriority = "critical" | "high" | "medium" | "low" | "none"

export type UserReportedErrorMessage = {
  created_at: string
  author: string
  note: string
  chat_id?: string
}

export type UserReportedError = {
  status: UserReportedErrorStatus
  messages: UserReportedErrorMessage[]
}

export type Status = {
  value: string
  type: StatusType
  details?: string | null
  sort_priority: number
  category: ErrorCategory
}

export type BotData = {
  id: number
  account_id: number
  meeting_url: string
  created_at: string
  session_id: string | null
  reserved: boolean
  errors: string | null
  ended_at: string | null
  mp4_s3_path: string
  uuid: string
  bot_param_id: number
  event_id: number | null
  scheduled_bot_id: number | null
  diarization_v2: boolean
  transcription_fails: number | null
  diarization_fails: number | null
  user_reported_error: UserReportedError
  params: {
    bot_name: string
    bot_image: string | null
    speech_to_text_provider: "Default" | "Gladia" | "Runpod" | null
    enter_message: string | null
    recording_mode: "speaker_view" | "gallery_view" | "audio_only" | null
    speech_to_text_api_key: string | null
    streaming_input: string | null
    streaming_output: string | null
    waiting_room_timeout: number | null
    noone_joined_timeout: number | null
    deduplication_key: string | null
    extra: Record<string, unknown>
    webhook_url: string
    streaming_audio_frequency: "16khz" | "24khz" | null
    zoom_sdk_id: string | null
    zoom_sdk_pwd: string | null
  }
  duration: number
  status: Status
}

export type BotPaginated = {
  has_more: boolean
  bots: BotData[]
}

export type FormattedBotData = BotData & {
  platform: PlatformName
}

export type FilterState = {
  platformFilters: string[]
  statusFilters: string[]
  userReportedErrorStatusFilters: string[]
  errorCategoryFilters: string[]
  errorPriorityFilters: string[]
}

export type PlatformDistribution = {
  platform: PlatformName
  count: number
  percentage: number
  statusDistribution: {
    success: { count: number; percentage: number }
    error: { count: number; percentage: number }
    warning: { count: number; percentage: number }
    pending: { count: number; percentage: number }
  }
}

export type ErrorDistribution = {
  name: string
  value: number
  percentage: number
}

export type TokenConsumptionByService = {
  duration: number
  transcription_hour: number
  transcription_byok_hour: number
  streaming_output_hour: number
  streaming_input_hour: number
  recording_tokens: number
  transcription_tokens: number
  transcription_byok_tokens: number
  streaming_output_tokens: number
  streaming_input_tokens: number
}

export type DailyTokenConsumption = {
  date: string
  consumption_by_service: TokenConsumptionByService
}

export type UserTokensResponse = {
  available_tokens: number
  total_tokens_purchased: number | undefined
  last_purchase_date: string | null
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid"

export type SubscriptionPlanType =
  | "PayAsYouGo"
  | "StarterPack"
  | "ProPack"
  | "BusinessPack"
  | "EnterprisePack"
  | "ScaleAPI"
  | "EnterpriseAPI"

export type SubscriptionResponse = {
  subscription: {
    email: string
    product: SubscriptionPlanType
    stripePlanId: string | null
    stripeProductId: string | null
    stripeSubscriptionStatus: SubscriptionStatus | null
    trialEnd: string | null
  }
}

export type ConsumptionChartData = {
  date: string
  recording: number
  transcription: number
  streaming: number
  duration: number
  transcription_hour: number
  streaming_input_hour: number
  streaming_output_hour: number
}

export type ErrorTableEntry = {
  type: string
  originalType: string
  message: string
  category: string
  priority: ErrorPriority
  platforms: Record<PlatformName, number>
  count: number
  botUuids: string[]
}

export type WebhookErrorGroup = {
  count: number
  messages: string[]
  bots: FormattedBotData[]
}

export type StalledErrorGroup = {
  values: number[]
  bots: FormattedBotData[]
}

export type NormalizedErrorGroup = {
  type: string
  message: string
  bots: FormattedBotData[]
}

export type TimelineEntry = {
  date: string
  total: number
  priorities: Array<{
    priority: string
    count: number
  }>
}

export type DurationTimelineEntry = {
  date: string
  averageDuration: number
  totalDuration: number
  botCount: number
}

export type PlatformDurationEntry = {
  name: string
  value: number
  count: number
}

export type DurationDistributionEntry = {
  range: string
  count: number
  percentage: number
}

export type IssueReportTimelineEntry = {
  date: string
  open: number
  in_progress: number
  closed: number
}

export type IssueReportData = {
  statusCounts: {
    open: number
    in_progress: number
    closed: number
  }
  timelineData: IssueReportTimelineEntry[]
}
