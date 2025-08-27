/// <reference types="node" />

import type { MeetingDataResponse } from "@/types/meeting-data";

/**
 * Get the meeting data for the current bot. Since it is called from RSCs,
 * it requires the complete URL + needs the apiKey to be passed
 * @param apiKey - The API key for the current user
 * @param bot_id - The bot id
 * @param include_transcripts - Whether to include transcript data in the response (defaults to true)
 * @returns The meeting data for the current bot
 */
export async function getMeetingData(
  apiKey: string,
  bot_id: string,
  include_transcripts: boolean = true
): Promise<MeetingDataResponse | null> {
  const urlParams = new URLSearchParams({
    bot_id,
    include_transcripts: include_transcripts.toString(),
  });
  try {
    const response = await fetch(
      `${
        process.env.API_SERVER_BASEURL
      }/bots/meeting_data?${urlParams.toString()}`,
      {
        method: "GET",
        headers: {
          "x-meeting-baas-api-key": apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get meeting data: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting meeting data:", error);
    return null;
  }
}
