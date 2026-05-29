import { getDashboardContext } from "./getDashboardContext.ts";
import type { MCPTool, UnfinishedTasksOutput } from "../interfaces.ts";

export const getUnfinishedTasks: MCPTool<void, UnfinishedTasksOutput> = {
  name: "get_unfinished_tasks",
  description: "Returns a list of unfinished tasks parsed from the dashboard context.",
  execute: async () => {
    const { emails } = await getDashboardContext.execute();
    
    // Simple heuristic for tasks from emails with Action Required / Due
    const tasks = emails
      .filter(e => e.subject.toLowerCase().includes('due') || e.snippet.toLowerCase().includes('action required'))
      .map(e => `Follow up on: ${e.subject}`);

    return {
      tasks,
    };
  },
};
