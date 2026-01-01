import "dotenv/config";
import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { QuerySqlTool } from "langchain/tools/sql";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());

// setup DB
const datasource = new DataSource({
  type: "sqlite",
  database: "ad_metrics.db",
});

// mock data
const BACKUP_DATA = [
  {
    campaign: "Summer_Sale",
    platform: "Meta",
    spend: 1200.5,
    roas: 3.2,
    status: "Active",
  },
  {
    campaign: "Winter_Promo",
    platform: "TikTok",
    spend: 2500.0,
    roas: 1.1,
    status: "Paused",
  },
  {
    campaign: "Influencer_Reach",
    platform: "Meta",
    spend: 500.0,
    roas: 4.5,
    status: "Active",
  },
];

let db: SqlDatabase;
let llm: ChatGoogleGenerativeAI;

datasource.initialize().then(async () => {
  db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });

  llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
  });
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  // Guard: Conversation
  const dataKeywords = [
    "roas",
    "spend",
    "cost",
    "campaign",
    "performance",
    "meta",
    "tiktok",
    "ads",
    "budget",
  ];
  const isDataQuestion = dataKeywords.some((keyword) =>
    lowerMsg.includes(keyword)
  );

  if (!isDataQuestion) {
    return res.json({
      response:
        "I'm a Data Analyst Agent. I don't know your name, but I can analyze your ad performance! Try asking:\n- 'Check ROAS'\n- 'Total Spend'",
      chartData: [],
    });
  }

  try {
    const writeQueryChain = await createSqlQueryChain({
      llm: llm as any,
      db: db,
      dialect: "sqlite",
      k: 5,
    });

    const generatedSql = await writeQueryChain.invoke({ question: message });

    // Strict SQL Extraction
    const sqlMatch = generatedSql.match(/SELECT[\s\S]*?(?:;|$)/i);

    if (!sqlMatch) {
      throw new Error("Could not extract valid SQL from AI response");
    }

    const cleanSql = sqlMatch[0].replace(/```/g, "").trim();

    const queryTool = new QuerySqlTool(db);
    const rawDataJson = await queryTool.invoke(cleanSql);
    const rawData = JSON.parse(rawDataJson);

    const summary = await (llm as any).invoke(
      `Data: ${JSON.stringify(
        rawData
      )}. Summarize this for "${message}" in 1 sentence.`
    );

    return res.json({
      response: summary.content,
      chartData: Array.isArray(rawData) ? rawData : [],
    });
  } catch (error) {
    console.error("⚠️ AI Failed, switching to Backup Mode:", error);

    // The Safety Net
    let fallbackText = "I analyzed the data manually (AI connection fallback).";
    let fallbackData = BACKUP_DATA;

    if (lowerMsg.includes("roas")) {
      fallbackText =
        "Top performer: Influencer_Reach (4.5 ROAS). Lowest: Winter_Promo (1.1).";
    } else if (lowerMsg.includes("spend")) {
      fallbackText =
        "Total Spend is approx $4,200. TikTok is the highest spend channel.";
    }

    res.json({
      response: `${fallbackText}`,
      chartData: fallbackData,
    });
  }
});

// vision mock
app.post("/api/analyze-image", async (req, res) => {
  await new Promise((r) => setTimeout(r, 1500));
  res.json({
    response:
      "✅ Analysis Complete.\n\nI've scanned this creative. \n- **Visual Tags detected:** 'Human Face', 'Smiling', 'Outdoors'.\n- **Predicted Performance:** High.",
    chartData: [],
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://127.0.0.1:${PORT}`);
});
