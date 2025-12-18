export type PlatformName = "zoom" | "teams" | "google meet" | "unknown"

export type Word = {
  id: number
  text: string
  start_time: number
  end_time: number
  bot_id: number
  user_id: null
}

export type Transcript = {
  id: number
  speaker: string
  bot_id: number
  start_time: number
  words: Word[]
  end_time: null
  user_id: null
  lang: null
}

export type Bot = {
  id: number
  account_id: number
  meeting_url: string
  created_at: string
  session_id: string
  reserved: boolean
  errors: null
  ended_at: string
  mp4_s3_path: string
  uuid: string
  bot_param_id: number
  event_id: null
  scheduled_bot_id: null
  diarization_v2: boolean
  transcription_fails: null
  diarization_fails: null
  user_reported_error: null
  bot_name: string
  bot_image: string
  speech_to_text_provider: string
  enter_message: null
  recording_mode: string
  speech_to_text_api_key: null
  streaming_input: null
  streaming_output: null
  waiting_room_timeout: null
  noone_joined_timeout: null
  deduplication_key: null
  extra: null
  webhook_url: string
  streaming_audio_frequency: null
  zoom_sdk_id: null
  zoom_sdk_pwd: null
}

export type BotData = {
  bot: Bot
  transcripts?: Transcript[]
}

export type NetworkSpeakerMetadata = {
  type: "metadata"
  id: number
  name: string
  fullName: string
  displayName: string
  profilePicture: string
}

export type MeetingDataResponse = {
  bot_data: BotData
  mp4: string
  duration: number
  speaker_diarization_file?: string
  speaker_diarization_file_network?: string
  speaker_metadata_file_network?: string
}
