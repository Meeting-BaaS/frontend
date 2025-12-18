export interface NetworkSpeakerEvent {
  name: string
  id: number
  timestamp: number
  isSpeaking: boolean
}

export interface NetworkStartTimeEvent {
  type: "start_time"
  meetingStartTime: number
}

export interface NetworkSpeakerSegment {
  speaker: string
  speakerId: number
  startMs: number
  endMs: number
}

/**
 * Parses network speaker events (state changes) into continuous speaking segments.
 * Pairs isSpeaking: true events with the next isSpeaking: false event for the same speaker.
 */
export function parseNetworkSegments(
  events: NetworkSpeakerEvent[]
): NetworkSpeakerSegment[] {
  const segments: NetworkSpeakerSegment[] = []

  // Sort events by timestamp to ensure correct pairing
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp)

  // Track active speakers (speaking but not yet ended)
  const activeSpeakers = new Map<number, { name: string; startMs: number }>()

  for (const event of sortedEvents) {
    if (event.isSpeaking) {
      // Speaker started speaking
      activeSpeakers.set(event.id, {
        name: event.name,
        startMs: event.timestamp,
      })
    } else {
      // Speaker stopped speaking
      const activeSegment = activeSpeakers.get(event.id)
      if (activeSegment) {
        segments.push({
          speaker: activeSegment.name,
          speakerId: event.id,
          startMs: activeSegment.startMs,
          endMs: event.timestamp,
        })
        activeSpeakers.delete(event.id)
      }
    }
  }

  // Handle any speakers still active at the end (optional: create open-ended segments)
  // For now, we'll ignore these as incomplete segments

  return segments
}

/**
 * Finds which network speaker was speaking at a given absolute timestamp.
 */
export function findSpeakerAtTime(
  absoluteTimeMs: number,
  segments: NetworkSpeakerSegment[]
): { speaker: string; speakerId: number } | null {
  for (const segment of segments) {
    if (absoluteTimeMs >= segment.startMs && absoluteTimeMs <= segment.endMs) {
      return {
        speaker: segment.speaker,
        speakerId: segment.speakerId,
      }
    }
  }
  return null
}

/**
 * Converts a payload word timestamp (relative seconds) to absolute Unix milliseconds.
 * Uses meetingStartTime from the network file as the anchor point.
 */
export function payloadTimeToAbsolute(
  payloadSeconds: number,
  meetingStartTimeMs: number
): number {
  return meetingStartTimeMs + payloadSeconds * 1000
}
