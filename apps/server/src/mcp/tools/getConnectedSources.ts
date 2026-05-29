import { verifyCoralSource } from "../../services/coralService.ts";
import { getPreferences } from "../../utils/preferences.ts";
import type { MCPTool, ConnectedSourcesOutput } from "../interfaces.ts";

export const getConnectedSources: MCPTool<void, ConnectedSourcesOutput> = {
  name: "get_connected_sources",
  description: "Returns the connection and enabled status of Coral data sources.",
  execute: async () => {
    const prefs = getPreferences();
    const [gmailConnected, calendarConnected] = await Promise.all([
      verifyCoralSource('gmail.emails'),
      verifyCoralSource('google_calendar.events')
    ]);

    return {
      sources: [
        { name: "gmail", status: gmailConnected && prefs.gmail_enabled ? "connected" : "disconnected" },
        { name: "google_calendar", status: calendarConnected && prefs.google_calendar_enabled ? "connected" : "disconnected" },
      ],
    };
  },
};
