import { getRecentEmails, getUpcomingEvents } from "./src/services/coralService.ts";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

async function run() {
  console.log("Testing Emails...");
  try {
    const emails = await getRecentEmails();
    console.log(`Found ${emails.length} emails`);
    if (emails.length > 0) {
      console.log(emails[0]);
    }
  } catch (err) {
    console.error("Email Error:", err);
  }

  console.log("\nTesting Events...");
  try {
    const events = await getUpcomingEvents();
    console.log(`Found ${events.length} events`);
    if (events.length > 0) {
      console.log(events[0]);
    }
  } catch (err) {
    console.error("Event Error:", err);
  }
}

run();
