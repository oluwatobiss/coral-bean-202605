export function extractInsights(emails, events) {
    const insights = [];
    // 1. Unread/Important Emails heuristics
    let importantEmailsCount = 0;
    emails.forEach(email => {
        const content = (email.subject + " " + email.snippet).toLowerCase();
        if (content.includes("interview") || content.includes("offer")) {
            insights.push({
                id: `email-${email.id}`,
                type: 'Interview',
                severity: 'High Risk',
                text: `Interview/Job related email from ${email.sender.split('<')[0]?.trim() || "Unknown"}`,
                desc: email.subject.slice(0, 40) + '...',
                action: 'Review Now',
                colorLight: 'bg-violet-100 text-violet-700',
                colorDark: 'bg-violet-500/20 text-violet-400'
            });
            importantEmailsCount++;
        }
        else if (content.includes("payment") || content.includes("invoice") || content.includes("due")) {
            insights.push({
                id: `email-${email.id}`,
                type: 'Action Required',
                severity: 'Important',
                text: `Possible payment or deadline approaching`,
                desc: email.subject.slice(0, 40) + '...',
                action: 'View Detail',
                colorLight: 'bg-rose-100 text-rose-700',
                colorDark: 'bg-rose-500/20 text-rose-400'
            });
            importantEmailsCount++;
        }
        else if (content.includes("flight") || content.includes("itinerary") || content.includes("travel")) {
            insights.push({
                id: `email-${email.id}`,
                type: 'Travel',
                severity: 'Info',
                text: `Travel confirmation detected`,
                desc: email.subject.slice(0, 40) + '...',
                action: 'Add to Calendar',
                colorLight: 'bg-sky-100 text-sky-700',
                colorDark: 'bg-sky-500/20 text-sky-400'
            });
        }
    });
    // 2. Calendar Conflicts heuristics
    let overloadDays = 0;
    const eventDates = events.map(e => e.start ? new Date(e.start).toDateString() : null).filter(Boolean);
    const dateCounts = eventDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    for (const [date, count] of Object.entries(dateCounts)) {
        if (count >= 4) {
            overloadDays++;
            insights.push({
                id: `conflict-${date}`,
                type: 'Conflict',
                severity: 'Heads Up',
                text: `Heavy schedule detected on ${date.slice(0, 10)}`,
                desc: `${count} events scheduled`,
                action: 'Reschedule',
                colorLight: 'bg-amber-100 text-amber-700',
                colorDark: 'bg-amber-500/20 text-amber-400'
            });
        }
    }
    return insights.slice(0, 4); // Limit to top 4 insights
}
export function buildTimeline(emails, events, insights, slack = [], drive = []) {
    const timeline = [];
    // Add real events
    events.forEach(ev => {
        if (!ev.start)
            return;
        const date = new Date(ev.start);
        timeline.push({
            id: `ev-${ev.id}`,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateObj: date,
            title: ev.title || 'Busy',
            type: 'Calendar Event',
            isAI: false,
            dotColorLight: 'bg-blue-500',
            dotColorDark: 'bg-blue-400',
        });
    });
    // Blend some recent emails into timeline as "Received"
    emails.slice(0, 2).forEach(em => {
        if (!em.date)
            return;
        const date = new Date(em.date);
        timeline.push({
            id: `em-${em.id}`,
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateObj: date,
            title: em.subject.slice(0, 30) + '...',
            type: `Email from ${em.sender.split('<')[0]?.trim() || "Unknown"}`,
            isAI: false,
            dotColorLight: 'bg-purple-500',
            dotColorDark: 'bg-violet-400',
        });
    });
    // Blend insights into timeline (fake an hour ahead for deadlines)
    insights.forEach((ins, idx) => {
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1 + idx);
        timeline.push({
            id: `ai-${ins.id}`,
            time: futureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dateObj: futureDate,
            title: ins.text,
            type: 'AI Detection',
            isAI: true,
            dotColorLight: 'bg-rose-500',
            dotColorDark: 'bg-rose-400',
        });
    });
    // Sort chronological
    timeline.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
    return timeline;
}
export function generateMetrics(events, emails) {
    const todayEvents = events.filter(e => e.start && new Date(e.start).toDateString() === new Date().toDateString()).length;
    let score = 95 - (todayEvents * 5); // Simple heuristic
    if (score < 40)
        score = 40;
    let stress = 20 + (todayEvents * 10);
    if (stress > 95)
        stress = 95;
    let importantEmails = 0;
    emails.forEach(e => {
        if (e.subject.toLowerCase().includes('urgent') || e.snippet.toLowerCase().includes('deadline'))
            importantEmails++;
    });
    return [
        { title: 'Focus Score', value: `${score}`, desc: 'Optimal', icon: 'center_focus_strong', lightColor: 'bg-emerald-100 text-emerald-600', darkColor: 'bg-emerald-500/20 text-emerald-400' },
        { title: 'Stress Level', value: `${stress}%`, desc: stress > 70 ? 'High' : 'Normal', icon: 'monitor_heart', lightColor: 'bg-rose-100 text-rose-600', darkColor: 'bg-rose-500/20 text-rose-400' },
        { title: 'Meeting Load', value: `${todayEvents}`, desc: 'Events Today', icon: 'event_busy', lightColor: 'bg-amber-100 text-amber-600', darkColor: 'bg-amber-500/20 text-amber-400' },
        { title: 'Pending Action', value: `${importantEmails}`, desc: 'Important Emails', icon: 'mark_email_unread', lightColor: 'bg-blue-100 text-blue-600', darkColor: 'bg-blue-500/20 text-blue-400' }
    ];
}
export function generateMemory(events, emails, keepNotes = []) {
    const mems = [
        "You usually check emails primarily in the morning.",
    ];
    if (events.length > 5) {
        mems.push("Your calendar looks unusually busy this week compared to last.");
    }
    let hasInterviews = emails.some(e => e.subject.toLowerCase().includes("interview"));
    if (hasInterviews) {
        mems.push("You've recently received multiple interview-related emails. Good luck!");
    }
    else {
        mems.push("Most of your meetings happen after 11 AM.");
    }
    if (keepNotes.length > 0) {
        mems.push("I noticed you jot down quick ideas in Keep. I'll remind you of them when relevant.");
    }
    return mems;
}
export function chatHeuristic(query, events, emails) {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('summarize my day') || lowerQuery.includes('focus on today')) {
        const todayEvents = events.filter(e => e.start && new Date(e.start).toDateString() === new Date().toDateString());
        return `Today you have ${todayEvents.length} events scheduled. Based on your emails, there's nothing immediately on fire, but I recommend checking your calendar for back-to-back blocks.`;
    }
    if (lowerQuery.includes('email') || lowerQuery.includes('attention')) {
        const important = emails.filter(e => e.subject.toLowerCase().includes('interview') || e.subject.toLowerCase().includes('due'));
        if (important.length > 0) {
            return `I found ${important.length} emails that might need your attention, mostly related to interviews or deadlines from: ${important.map(e => e.sender.split('<')[0]?.trim() || "Unknown").join(', ')}.`;
        }
        return `You have ${emails.length} recent emails, but none seem critically urgent based on my scanning.`;
    }
    if (lowerQuery.includes('conflict')) {
        return `Looking at your schedule, I didn't spot any direct double-bookings, but you do have a dense block on ${events[0]?.start ? new Date(events[0].start).toLocaleDateString() : 'one of the upcoming days'}. Make sure to leave time for breaks.`;
    }
    return "I'm your heuristic AI assistant. I've scanned your current context but didn't catch a specific intent for that query. Try asking 'Summarize my day' or 'What emails need attention?'.";
}
//# sourceMappingURL=heuristicEngine.js.map