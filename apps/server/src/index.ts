import * as dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import { processDashboardData, processChat, getActiveNotifications } from "./ai/aiEngine.js";
import { getRecentEmails, getUpcomingEvents } from "./services/coralService.js";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from @neverlate/server (Coral Native)!");
});

// Coral-powered Data Endpoints (keeping legacy routes for frontend compatibility)
app.get("/api/google/emails", async (req, res) => {
  try {
    const data = await getRecentEmails();
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

// AI Endpoints powered by Coral Data
app.get("/api/ai/dashboard", async (req, res) => {
  try {
    const [emails, events] = await Promise.all([
      getRecentEmails(),
      getUpcomingEvents(),
    ]);
    const data = await processDashboardData(emails, events);
    res.json(data);
  } catch (error) {
    console.error("Error in AI dashboard", error);
    res.status(500).json({ error: "Failed to process AI dashboard data" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { query } = req.body;
    const [emails, events] = await Promise.all([
      getRecentEmails(),
      getUpcomingEvents(),
    ]);
    const reply = await processChat(query, emails, events);
    res.json({ reply });
  } catch (error) {
    console.error("Error in AI chat", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

app.get("/api/ai/notifications", async (req, res) => {
  try {
    const [emails, events] = await Promise.all([
      getRecentEmails(),
      getUpcomingEvents(),
    ]);
    const notifications = getActiveNotifications(emails, events);
    res.json(notifications);
  } catch (error) {
    console.error("Error in AI notifications", error);
    res.status(500).json({ error: "Failed to process notifications" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
