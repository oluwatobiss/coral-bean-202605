import * as dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import { processDashboardData, processChat, getActiveNotifications } from "./ai/aiEngine.ts";
import { getRecentEmails, getUpcomingEvents, verifyCoralSource } from "./services/coralService.ts";
import { getPreferences, updatePreference } from "./utils/preferences.ts";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Allow all origins for dev to prevent port-hopping CORS issues
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from @neverlate/server (Coral Native)!");
});

// Coral-powered Data Endpoints (keeping legacy routes for frontend compatibility)
app.get("/api/google/emails", async (req, res) => {
  try {
    const data = await getRecentEmails();
    console.log("=== Fetched Emails ===");
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching emails via Coral", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
});

app.get("/api/google/calendar", async (req, res) => {
  try {
    const data = await getUpcomingEvents();
    res.json(data);
  } catch (error) {
    console.error("Error fetching calendar events via Coral", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});



// Coral Source Management Endpoints
app.get("/api/sources/status", async (req, res) => {
  try {
    const prefs = getPreferences();
    const [gmailConnected, calendarConnected] = await Promise.all([
      verifyCoralSource('gmail.emails'),
      verifyCoralSource('google_calendar.events')
    ]);

    res.json({
      gmail: { connected: gmailConnected, enabled: prefs.gmail_enabled },
      calendar: { connected: calendarConnected, enabled: prefs.google_calendar_enabled },
      slack: { connected: false, enabled: false },
      drive: { connected: false, enabled: false },
      keep: { connected: false, enabled: false }
    });
  } catch (error) {
    console.error("Error fetching source status", error);
    res.status(500).json({ error: "Failed to fetch source status" });
  }
});

app.post("/api/sources/connect", async (req, res) => {
  try {
    const { sourceId } = req.body;
    let tableName = "";
    if (sourceId === "gmail") tableName = "gmail.emails";
    else if (sourceId === "calendar") tableName = "google_calendar.events";
    else return res.status(400).json({ error: "Unknown source ID" });

    const isConnected = await verifyCoralSource(tableName);
    if (!isConnected) {
      return res.status(404).json({ error: "Source not found in Coral. Please configure the CLI." });
    }

    // Force enabled to true since the user actively verified it
    updatePreference(`${sourceId}_enabled` as any, true);
    
    res.json({ success: true, connected: true, enabled: true });
  } catch (error) {
    console.error("Error verifying source connection", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.post("/api/sources/disable", async (req, res) => {
  try {
    const { sourceId } = req.body;
    if (sourceId !== "gmail" && sourceId !== "calendar") {
      return res.status(400).json({ error: "Unknown source ID" });
    }

    updatePreference(`${sourceId}_enabled` as any, false);
    res.json({ success: true, enabled: false });
  } catch (error) {
    console.error("Error disabling source", error);
    res.status(500).json({ error: "Disable failed" });
  }
});

// AI Endpoints powered by Coral Data via MCP Layer
app.get("/api/ai/dashboard", async (req, res) => {
  try {
    const data = await processDashboardData();
    res.json(data);
  } catch (error) {
    console.error("Error in AI dashboard", error);
    res.status(500).json({ error: "Failed to process AI dashboard data" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { query } = req.body;
    const reply = await processChat(query);
    res.json({ reply });
  } catch (error) {
    console.error("Error in AI chat", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

app.get("/api/ai/notifications", async (req, res) => {
  try {
    const notifications = await getActiveNotifications();
    res.json(notifications);
  } catch (error) {
    console.error("Error in AI notifications", error);
    res.status(500).json({ error: "Failed to process notifications" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
