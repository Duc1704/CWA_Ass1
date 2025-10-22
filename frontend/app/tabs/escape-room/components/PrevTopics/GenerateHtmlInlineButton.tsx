import React, { useState } from "react";
import { generateGameHTML } from "../../../../services/lambda";

type Item = { question: string; answer: string; hints: [string, string, string] };
type Topic = { title: string; items: Item[]; timerSeconds: number };

type Props = {
  topic: Topic;
  className?: string;
  onUrl?: (url: string) => void;
};

export default function GenerateHtmlInlineButton({ topic, className, onUrl }: Props): JSX.Element {
  const [generating, setGenerating] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setUrl(null);
    try {
      const padded = [0,1,2,3].map((i) => topic.items[i] ? topic.items[i] : { question: "", answer: "", hints: ["", "", ""] as [string,string,string] });
      const itemsData = padded.map((it) => ({ question: it.question, answer: it.answer, hint1: it.hints[0] || "", hint2: it.hints[1] || "", hint3: it.hints[2] || "" }));
      const secs = Math.max(10, Math.min(3600, Number((topic as any).timerSeconds || 300)));
      const resp = await generateGameHTML({ name: topic.title, timeLimit: secs, questions: itemsData }, topic.title);
      const body = typeof resp?.body === "string" ? JSON.parse(resp.body) : (resp?.body || resp);
      const link = body?.url ?? resp?.url;
      if (!link) throw new Error("Missing url in Lambda response");
      setUrl(link);
      if (onUrl) onUrl(link);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={className}>
      <button
        className="px-4 py-2 rounded-md bg-purple-600/90 text-white border border-white/20 hover:bg-purple-600 disabled:opacity-50"
        disabled={generating}
        onClick={handleGenerate}
      >
        {generating ? "Generating..." : "Generate HTML"}
      </button>
      {url && (
        <div className="mt-2 text-sm">
          <a className="underline break-all" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </div>
      )}
      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </div>
  );
}
