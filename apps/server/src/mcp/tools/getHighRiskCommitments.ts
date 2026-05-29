import { getDashboardContext } from "./getDashboardContext.ts";
import { extractInsights } from "../../ai/heuristicEngine.ts";
import type { MCPTool, HighRiskCommitmentsOutput } from "../interfaces.ts";

export const getHighRiskCommitments: MCPTool<void, HighRiskCommitmentsOutput> = {
  name: "get_high_risk_commitments",
  description: "Identifies high risk commitments such as interviews or urgent deadlines.",
  execute: async () => {
    const { emails, events } = await getDashboardContext.execute();
    const insights = extractInsights(emails, events);

    return {
      risks: insights.filter(i => i.severity === 'High Risk' || i.severity === 'Important'),
    };
  },
};
