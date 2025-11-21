// types/hashtag.d.ts

export type Platform =
  | "instagram"
  | "tiktok"
  | "twitter"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "pinterest";

export type Strategy = "balanced" | "trending" | "niche";

export interface HashtagRequest {
  description: string;
  platform: Platform;
  strategy: Strategy;
  language: string; // e.g. "English"
  location: string; // NEW
}

export interface HashtagSuggestion {
  tag: string;
  explanation: string;
  viralScore: number; // 0–100
}

export interface HashtagResponse {
  hashtags: HashtagSuggestion[];
  error?: string;
}
