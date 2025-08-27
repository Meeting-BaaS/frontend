import type { MeetingDataResponse } from "@/types/meeting-data";
import { useEffect, useState } from "react";

interface UseProgressiveTranscriptsOptions {
  initialMeetingData: MeetingDataResponse;
  apiKey: string;
  botId: string;
}

interface UseProgressiveTranscriptsReturn {
  meetingData: MeetingDataResponse;
  isLoadingTranscripts: boolean;
  transcriptsLoaded: boolean;
  error: string | null;
  retryLoading: () => void;
}

export function useProgressiveTranscripts({
  initialMeetingData,
  apiKey,
  botId,
}: UseProgressiveTranscriptsOptions): UseProgressiveTranscriptsReturn {
  const [meetingData, setMeetingData] =
    useState<MeetingDataResponse>(initialMeetingData);
  const [isLoadingTranscripts, setIsLoadingTranscripts] = useState(false);
  const [transcriptsLoaded, setTranscriptsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if initial data already includes transcripts
  const hasTranscripts =
    (initialMeetingData.bot_data.transcripts?.length ?? 0) > 0;

  const loadTranscripts = async () => {
    setIsLoadingTranscripts(true);
    setError(null);

    try {
      const response = await fetch("/api/meeting-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          botId,
          include_transcripts: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to load transcripts: ${response.status}`);
      }

      const dataWithTranscripts: MeetingDataResponse = await response.json();
      setMeetingData(dataWithTranscripts);
      setTranscriptsLoaded(true);
    } catch (err) {
      console.error("Error loading transcripts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load transcripts"
      );
    } finally {
      setIsLoadingTranscripts(false);
    }
  };

  const retryLoading = () => {
    if (!transcriptsLoaded && !isLoadingTranscripts) {
      loadTranscripts();
    }
  };

  useEffect(() => {
    // If we already have transcripts, no need to load them again
    if (hasTranscripts) {
      setTranscriptsLoaded(true);
      return;
    }

    // Auto-load transcripts after initial render
    const timeoutId = setTimeout(loadTranscripts, 100);
    return () => clearTimeout(timeoutId);
  }, [apiKey, botId, hasTranscripts]);

  return {
    meetingData,
    isLoadingTranscripts,
    transcriptsLoaded,
    error,
    retryLoading,
  };
}
