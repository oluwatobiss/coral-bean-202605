export interface Email {
    id: string;
    subject: string;
    sender: string;
    snippet: string;
    date: string;
    labels?: string[];
    priority?: string;
}
export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    location: string;
    priority?: string;
}
export interface SlackMessage {
    id: string;
    channel: string;
    sender: string;
    text: string;
}
export interface DriveFile {
    id: string;
    name: string;
    lastModified: string;
}
export interface KeepNote {
    id: string;
    title: string;
    content: string;
}
export interface Insight {
    id: string;
    type: string;
    severity: 'High Risk' | 'Important' | 'Heads Up' | 'Info';
    text: string;
    desc: string;
    action: string;
    colorLight: string;
    colorDark: string;
}
export interface TimelineEvent {
    id: string;
    time: string;
    dateObj: Date;
    title: string;
    type: string;
    isAI: boolean;
    dotColorLight: string;
    dotColorDark: string;
}
export declare function extractInsights(emails: Email[], events: CalendarEvent[]): Insight[];
export declare function buildTimeline(emails: Email[], events: CalendarEvent[], insights: Insight[], slack?: SlackMessage[], drive?: DriveFile[]): TimelineEvent[];
export declare function generateMetrics(events: CalendarEvent[], emails: Email[]): {
    title: string;
    value: string;
    desc: string;
    icon: string;
    lightColor: string;
    darkColor: string;
}[];
export declare function generateMemory(events: CalendarEvent[], emails: Email[], keepNotes?: KeepNote[]): string[];
export declare function chatHeuristic(query: string, events: CalendarEvent[], emails: Email[]): string;
//# sourceMappingURL=heuristicEngine.d.ts.map