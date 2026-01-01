import { Request, Response } from "express";
import sqlAgent = require("../agents/sqlAgent");

const agent = new sqlAgent.AdInsightAgent();

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, platform } = req.body;

    const context =
      platform === "slack"
        ? "Format nicely for Slack Markdown"
        : "Format for JSON API";

    const result = await agent.processQuery(`${message}. Note: ${context}`);

    // to render graphs
    res.json({
      success: true,
      response: result.text,
      chartData: result.data,
    });
  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ error: "My AI brain is foggy right now." });
  }
};
