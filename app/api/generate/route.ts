import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import {
  type HashtagRequest,
  type HashtagResponse,
  type HashtagSuggestion,
} from "@/types/hashtag";
import { buildHashtagPrompt } from "@/utils/prompts";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: HashtagRequest = await req.json();

    if (!body.description?.trim()) {
      return NextResponse.json(
        { hashtags: [], error: "Please describe your post first." },
        { status: 400 }
      );
    }

    const prompt = buildHashtagPrompt(
      body.description,
      body.platform,
      body.strategy,
      body.language,
      body.location
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0].message?.content ?? "";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("RAW AI RESPONSE (INVALID JSON):", raw);
      return NextResponse.json(
        {
          hashtags: [],
          error: "Couldn't understand AI response. Please try again.",
        },
        { status: 500 }
      );
    }

    // JSON mode output MUST contain: { hashtags: [...] }
    if (!parsed || !Array.isArray(parsed.hashtags)) {
      console.error("AI response missing 'hashtags':", parsed);
      return NextResponse.json(
        {
          hashtags: [],
          error: "AI returned an invalid format. Try again.",
        },
        { status: 500 }
      );
    }

    const hashtags: HashtagSuggestion[] = parsed.hashtags
      .map((item: any): HashtagSuggestion | null => {
        if (
          !item ||
          typeof item.tag !== "string" ||
          typeof item.explanation !== "string"
        ) {
          return null;
        }

        let score = Number(item.viralScore);
        if (!Number.isFinite(score)) score = 0;
        score = Math.max(0, Math.min(100, Math.round(score)));

        const tag = item.tag.startsWith("#") ? item.tag : `#${item.tag}`;

        return {
          tag,
          explanation: item.explanation,
          viralScore: score,
        };
      })
      .filter((x:any): x is HashtagSuggestion => x !== null);

    return NextResponse.json({ hashtags });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { hashtags: [], error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
