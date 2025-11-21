// utils/prompts.ts
import type { Platform, Strategy } from "@/types/hashtag";

export function buildHashtagPrompt(
  description: string,
  platform: Platform,
  strategy: Strategy,
  language: string,
  location: string
): string {
  return `
You are an expert social media strategist and hashtag optimization consultant.

Task:
Generate a set of highly relevant, high-performing hashtags for the platform: ${platform}.
The content being posted is described as:
"${description}"

Language target: ${language}
Location target: ${location}

Hashtag strategy: ${strategy}
- "balanced" = trending + niche + evergreen mix
- "trending" = high-discovery, viral potential tags
- "niche" = ultra-targeted, low-competition tags

You MUST return ONLY a JSON object with this exact structure:

{
  "hashtags": [
    {
      "tag": "#example",
      "explanation": "Short explanation in the selected language.",
      "viralScore": 0
    }
  ]
}

Rules:
- 10 to 15 hashtags
- "tag" must ALWAYS start with "#"
- "viralScore" MUST be an integer between 0 and 100
- Explanations MUST be in the selected language
- Hashtags MUST be relevant to location, language, platform, and strategy
- ABSOLUTELY NO text before or after the JSON block
`;
}
