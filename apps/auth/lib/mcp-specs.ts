export type McpServerSpec = {
  name: string
  displayName: string
  description: string
  githubUrl: string
  serverUrl?: string
  envVars?: { label: string; value: string | null; sensitive?: boolean }[]
  localConfig?: object
}

export const mcpSpecs: McpServerSpec[] = [
  {
    name: "mcp-on-vercel",
    displayName: "BaaS API",
    description: "The BaaS API MCP, built with our official SDK.",
    githubUrl: "https://github.com/Meeting-Baas/mcp-on-vercel",
    serverUrl: "https://mcp.meetingbaas.com/sse",
    envVars: [
      {
        label: "REDIS_URL",
        value: process.env.NEXT_PUBLIC_REDIS_URL_MCP || "",
        sensitive: true
      },
      { label: "x-meeting-baas-api-key", value: "", sensitive: true },
      { label: "BAAS_URL", value: "https://api.meetingbaas.com/sse", sensitive: false }
    ],
    localConfig: {
      mcpServers: {
        BaaSAPI: {
          url: "https://mcp.meetingbaas.com/sse",
          env: {
            BAAS_URL: "https://api.meetingbaas.com",
            REDIS_URL: process.env.NEXT_PUBLIC_REDIS_URL_MCP || "",
            "x-meeting-baas-api-key": ""
          }
        }
      }
    }
  },
  {
    name: "mcp-on-vercel-documentation",
    displayName: "BaaS API Documentation",
    description: "An MCP server to deliver context to your code editor and the MeetingBaaS chat.",
    githubUrl: "https://github.com/Meeting-Baas/mcp-on-vercel-documentation",
    serverUrl: "https://mcp-documentation.meetingbaas.com/sse",
    envVars: [
      { label: "BAAS_URL", value: "https://api.meetingbaas.com", sensitive: false },
      {
        label: "REDIS_URL",
        value: process.env.NEXT_PUBLIC_REDIS_URL_MCP || "",
        sensitive: true
      },
      { label: "x-meeting-baas-api-key", value: "", sensitive: true }
    ],
    localConfig: {
      mcpServers: {
        MeetingBaasDocs: {
          url: "https://mcp-documentation.meetingbaas.com/sse",
          env: {
            BAAS_URL: "https://api.meetingbaas.com",
            REDIS_URL: process.env.NEXT_PUBLIC_REDIS_URL_MCP || "",
            "x-meeting-baas-api-key": ""
          }
        }
      }
    }
  },
  {
    name: "speaking-bots-mcp",
    displayName: "Speaking Bots",
    description: "An MCP server that can send speaking bots inside meetings. Hosted.",
    githubUrl: "https://github.com/Meeting-Baas/speaking-bots-mcp",
    serverUrl: "https://speaking-mcp.meetingbaas.com",
    envVars: [
      {
        label: "REDIS_URL",
        value: process.env.NEXT_PUBLIC_REDIS_URL_MCP || "",
        sensitive: true
      },
      { label: "x-meeting-baas-api-key", value: "", sensitive: true },
      { label: "BAAS_URL", value: "https://api.meetingbaas.com", sensitive: false }
    ],
    localConfig: {
      mcpServers: {
        SpeakingBots: {
          url: "https://speaking-bots-mcp.meetingbaas.com/sse",
          env: {
            BAAS_URL: "https://api.meetingbaas.com",
            REDIS_URL: process.env.NEXT_PUBLIC_REDIS_URL_MCP || "",
            "x-meeting-baas-api-key": ""
          }
        }
      }
    }
  },
  {
    name: "meeting-mcp",
    displayName: "End User Meetings",
    description:
      "MVP. MCP server to search transcripts, manage meeting recordings, and more. Runs locally.",
    githubUrl: "https://github.com/Meeting-Baas/meeting-mcp",
    localConfig: {
      mcpServers: {
        "meeting-server-http": {
          command: "/bin/bash",
          args: [
            "-c",
            "cd $REPO_PATH && source .env && exec cargo run -- --http --port 7018 >/dev/stderr 2>&1"
          ],
          url: "http://localhost:7018/api",
          headers: {
            "x-api-key": ""
          },
          botConfig: {
            name: "Meeting Tools",
            image: "https://example.com/meeting-icon.png",
            entryMessage:
              "Hello! I'm your meeting assistant with access to meeting creation, scheduling, and recording tools."
          }
        }
      }
    }
  }
]
