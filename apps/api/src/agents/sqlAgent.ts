import { ChatOpenAI } from "@langchain/openai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";

// using sqlite for local testing
const datasource = new DataSource({
  type: "sqlite",
  database: "ad_metrics.db",
});

export class AdInsightAgent {
  private model: ChatOpenAI;
  private db: SqlDatabase | undefined;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4-turbo",
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  // handles db connection
  async init() {
    if (!this.db) {
      if (!datasource.isInitialized) {
        await datasource.initialize();
      }
      this.db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
      });
    }
  }

  async processQuery(userQuestion: string) {
    if (!this.db) {
      await this.init();
    }

    if (!this.db) throw new Error("Database failed to initialize");

    // setup the sql chain
    const sqlChain = await createSqlQueryChain({
      llm: this.model,
      db: this.db,
      dialect: "sqlite",
    });

    // let AI write the qury
    const generatedSql = await sqlChain.invoke({ question: userQuestion });

    const rawData = await this.db.run(generatedSql);

    // have AI interpret the results
    const analysisPrompt = `
      You are WillBot, a senior marketing analyst.
      The user asked: "${userQuestion}"
      The database returned: ${JSON.stringify(rawData)}
      
      Provide a concise, actionable insight. If ROAS is below 2.0, flag it as a risk.
    `;

    const response = await this.model.invoke(analysisPrompt);

    return {
      text: response.content,
      data: JSON.parse(rawData),
    };
  }
}
