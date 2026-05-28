import { type Email, type CalendarEvent } from "./heuristicEngine.js";
export declare function processDashboardData(emails: Email[], events: CalendarEvent[]): Promise<{
    summary: string;
    insights: import("./heuristicEngine.js").Insight[];
    timeline: import("./heuristicEngine.js").TimelineEvent[];
    metrics: {
        title: string;
        value: string;
        desc: string;
        icon: string;
        lightColor: string;
        darkColor: string;
    }[];
    memory: string[];
}>;
export declare function processChat(query: string, emails: Email[], events: CalendarEvent[]): Promise<string>;
export declare function getActiveNotifications(emails: Email[], events: CalendarEvent[]): {
    id: string;
    message: string;
    type: string;
    time: string;
}[];
//# sourceMappingURL=aiEngine.d.ts.map