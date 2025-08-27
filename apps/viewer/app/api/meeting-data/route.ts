import { getMeetingData } from "@/lib/api/meeting-data";
import { getAuthSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the session from cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const session = await getAuthSession(cookieHeader);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey, botId, include_transcripts } = body;

    // Validate required parameters
    if (!apiKey || !botId) {
      return NextResponse.json(
        { error: "Missing required parameters: apiKey and botId" },
        { status: 400 }
      );
    }

    // Verify the API key matches the session user's key for security
    if (apiKey !== session.user.botsApiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }

    const meetingData = await getMeetingData(
      apiKey,
      botId,
      include_transcripts
    );

    if (!meetingData) {
      return NextResponse.json(
        { error: "Meeting data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(meetingData);
  } catch (error) {
    console.error("Error in meeting-data API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
