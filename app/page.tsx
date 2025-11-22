"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import type {
  HashtagRequest,
  HashtagResponse,
  HashtagSuggestion,
  Platform,
  Strategy,
} from "@/types/hashtag";

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "twitter", label: "Twitter / X" },
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "pinterest", label: "Pinterest" },
];

const LANGUAGES = [
  "English",
  "Spanish",
  "Portuguese",
  "German",
  "French",
  "Italian",
  "Russian",
  "Arabic",
  "Hindi",
  "Japanese",
];

const LOCATIONS = [
  "Global",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "India",
  "Japan",
  "South Korea",
  "Indonesia",
  "Turkey",
  "United Arab Emirates",
  "Saudi Arabia",
];

const STRATEGIES: { id: Strategy; label: string; hint: string }[] = [
  { id: "balanced", label: "Balanced", hint: "Mix of trending, niche & evergreen" },
  { id: "trending", label: "Trending", hint: "Focus on high discovery & virality" },
  { id: "niche", label: "Niche", hint: "Targeted, specific & low-competition" },
];

export default function HomePage() {
  const [description, setDescription] = useState<string>("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [strategy, setStrategy] = useState<Strategy>("balanced");
  const [language, setLanguage] = useState<string>("English");
  const [location, setLocation] = useState<string>("Global");
  const [hashtags, setHashtags] = useState<HashtagSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const [progress, setProgress] = useState<number>(0);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);

  const remaining = 500 - description.length;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (loading) {
      setShowProgressBar(true);
      setProgress(0);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + Math.random() * 10;
          return prev;
        });
      }, 300);
    } else {
      setProgress(200);
      setTimeout(() => setShowProgressBar(false), 400);
    }

    return () => clearInterval(interval);
  }, [loading]);

  const scoreColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const showCopyMessage = (msg: string) => {
    setCopyMessage(msg);
    setTimeout(() => setCopyMessage(null), 2000);
  };

  const copyHashtags = async (list: HashtagSuggestion[]) => {
    if (!list.length) return;

    const text = list.map((h) => h.tag).join(" ");
    try {
      await navigator.clipboard.writeText(text);
      showCopyMessage("Copied hashtags to clipboard.");
    } catch {
      showCopyMessage("Could not copy. Please try again.");
    }
  };

  const onCopyAll = () => copyHashtags(hashtags);
  const onCopyTopFive = () =>
    copyHashtags([...hashtags].sort((a, b) => b.viralScore - a.viralScore).slice(0, 5));

  const onGenerate = async () => {
    if (!description.trim()) {
      setError("Please describe your post before generating hashtags.");
      return;
    }

    setLoading(true);
    setError(null);
    setHashtags([]);

    const body: HashtagRequest = {
      description,
      platform,
      strategy,
      language,
      location,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: HashtagResponse = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setHashtags(data.hashtags || []);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>

      {/* TOP PROGRESS BAR */}
      {showProgressBar && (
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-indigo-500 transition-all duration-200 z-50"
          style={{ width: `${progress}%` }}
        />
      )}

      <div className={styles.shell}>

        {/* HEADER */}
        <header className="mb-6 flex items-center gap-4">
          <div className={styles.logoPlaceholder}>
            <img src="pulsetags.png" alt="logo" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              PulseTags
            </h1>
            <p className="text-sm sm:text-base text-foreground-muted mt-1">
              Generate smart, platform-aware hashtags with explanations, viral scores, languages & location targeting.
            </p>
          </div>
        </header>

        {/* FEATURE CHIPS */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs text-foreground-soft">
          <span className="rounded-full bg-background px-3 py-1 border border-soft">✨ Multilingual hashtags</span>
          <span className="rounded-full bg-background px-3 py-1 border border-soft">🌍 Location-based generation</span>
          <span className="rounded-full bg-background px-3 py-1 border border-soft">📊 Viral score per hashtag</span>
        </div>

        {/* MAIN CARD */}
        <section className={`${styles.card} bg-card border border-soft`}>

          {/* DESCRIPTION */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground-soft mb-2">
              Describe your post
            </label>

            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 500) setDescription(e.target.value);
              }}
              placeholder="Example: A cozy morning coffee routine TikTok..."
              className="w-full min-h-[110px] rounded-lg border border-soft bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-foreground"
            />

            <div className="mt-1 flex justify-between text-xs text-foreground-muted">
              <span>Up to 500 characters</span>
              <span>{remaining} left</span>
            </div>
          </div>

          {/* PLATFORMS */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground-soft mb-2">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    p.id === platform
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-background text-foreground-soft border-soft hover:border-indigo-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE / LOCATION / STRATEGY */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-foreground-soft mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-soft bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 text-foreground"
              >
                {LANGUAGES.map((lang) => <option key={lang}>{lang}</option>)}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-foreground-soft mb-2">Target Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-soft bg-card px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 text-foreground"
              >
                {LOCATIONS.map((loc) => <option key={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Strategy */}
            <div>
              <label className="block text-sm font-medium text-foreground-soft mb-2">Hashtag style</label>
              <div className="flex flex-wrap gap-2">
                {STRATEGIES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStrategy(s.id)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition ${
                      strategy === s.id
                        ? "bg-indigo-50 text-indigo-700 border-indigo-400"
                        : "bg-background text-foreground-soft border-soft hover:border-indigo-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-foreground-muted">
                {STRATEGIES.find((s) => s.id === strategy)?.hint}
              </p>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onGenerate}
              disabled={loading || !description.trim()}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium shadow-sm transition ${
                loading || !description.trim()
                  ? "bg-indigo-300 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Generating..." : "Generate hashtags"}
            </button>

            {error && <p className="text-xs text-rose-500 sm:text-right">{error}</p>}
            {copyMessage && !error && (
              <p className="text-xs text-emerald-600 sm:text-right">{copyMessage}</p>
            )}
          </div>
        </section>

        {/* RESULTS */}
        {hashtags.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-medium text-foreground-soft">Suggested hashtags</h2>

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={onCopyAll}
                  className="rounded-full border border-soft bg-card px-3 py-1 hover:border-indigo-300"
                >
                  Copy all
                </button>
                <button
                  onClick={onCopyTopFive}
                  className="rounded-full border border-soft bg-card px-3 py-1 hover:border-indigo-300"
                >
                  Copy top 5 most viral
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {hashtags.map((item, idx) => (
                <article
                  key={idx}
                  className="rounded-xl border border-soft bg-card p-3.5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold truncate text-foreground">
                      {item.tag}
                    </h3>
                    <span className="text-xs text-foreground-muted">
                      Viral score: <span className="text-foreground">{item.viralScore}</span>
                    </span>
                  </div>

                  <p className="text-xs text-foreground-soft mb-3">{item.explanation}</p>

                  <div>
                    <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${scoreColor(item.viralScore)}`}
                        style={{ width: `${item.viralScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-wide text-foreground-muted mt-1">
                      visual viral potential
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
