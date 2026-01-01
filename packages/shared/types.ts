export interface AdCreative {
  id: string;
  name: string;
  platform: "Meta" | "TikTok";
  spend: number;
  impressions: number;
  conversions: number;
  roas: number;
  visualTags: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  data?: any;
}
