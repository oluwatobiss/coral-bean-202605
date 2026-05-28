import type { Email, CalendarEvent } from "../ai/heuristicEngine.js";
export declare function getRecentEmails(): Promise<Email[]>;
export declare function getUpcomingEvents(): Promise<CalendarEvent[]>;
export declare function getDashboardContext(): Promise<{
    emails: Email[];
    events: CalendarEvent[];
}>;
//# sourceMappingURL=coralService.d.ts.map