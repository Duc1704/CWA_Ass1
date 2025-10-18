import React, { useEffect, useMemo, useState } from "react";

type WizardItem = {
  question: string;
  hints: [string, string, string];
  answer: string;
};

export default function EscapeRoomTab(): JSX.Element {
  const baseBg = useMemo(() => "/images/backGround.png", []);
  // Editable hotspot positions per phase (percentages). Adjust here to move buttons.
  // Example: { top: "42%", left: "50%" }
  const PHASE_HOTSPOTS = useMemo(() => ({
    0: {
      hints: [
        { top: "75%", left: "72%" },
        { top: "66%", left: "20%" },
        { top: "66%", left: "82%" },
      ],
      lock: { top: "50%", left: "28%" },
    },
    1: {
      hints: [
        { top: "70%", left: "70%" },
        { top: "65%", left: "40%" },
        { top: "90%", left: "20%" },
      ],
      lock: { top: "45%", left: "50%" },
    },
    2: {
      hints: [
        { top: "75%", left: "60%" },
        { top: "47%", left: "25%" },
        { top: "64%", left: "80%" },
      ],
      lock: { top: "50%", left: "46%" },
    },
    3: {
      hints: [
        { top: "80%", left: "70%" },
        { top: "75%", left: "13%" },
        { top: "66%", left: "40%" },
      ],
      lock: { top: "53%", left: "51%" },
    },
  } as Record<number, { hints: Array<{ top: string; left: string }>; lock: { top: string; left: string } }>), []);

  // Wizard for 4 questions
  const [wizardStep, setWizardStep] = useState<number>(0); // 0..3
  const [items, setItems] = useState<WizardItem[]>([
    { question: "", hints: ["", "", ""], answer: "" },
    { question: "", hints: ["", "", ""], answer: "" },
    { question: "", hints: ["", "", ""], answer: "" },
    { question: "", hints: ["", "", ""], answer: "" },
  ]);

  type Flow = "mode" | "customEntry" | "topicName" | "wizard" | "prevTopics" | "game" | "bad" | "good";
  const [flow, setFlow] = useState<Flow>("mode");
  const [mode, setMode] = useState<"default" | "custom" | "">("");
  const [currentTopicTitle, setCurrentTopicTitle] = useState<string>("");
  const [modeError, setModeError] = useState<string>("");

  // Game state
  const [stageIndex, setStageIndex] = useState<number>(0); // 0..3
  const [answerInputs, setAnswerInputs] = useState<string[]>(["", "", "", ""]);
  const [answerErrors, setAnswerErrors] = useState<string[]>(["", "", "", ""]);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean[]>([false, false, false, false]);
  const [openPanel, setOpenPanel] = useState<"qa" | "hint1" | "hint2" | "hint3" | null>(null);

  // Timer
  const [initialSeconds, setInitialSeconds] = useState<number>(300);
  const [remaining, setRemaining] = useState<number>(300);
  const [running, setRunning] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [persistError, setPersistError] = useState<string>("");

  // Saved topics fetched from API when needed
  const [savedTopics, setSavedTopics] = useState<Array<{ title: string; timerSeconds: number; items: { question: string; answer: string; hints: [string, string, string] }[] }>>([]);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (flow === "game" && remaining === 0) {
      setRunning(false);
      setFlow("bad");
    }
  }, [remaining, flow]);

  const formatTime = (total: number) => {
    const mm = Math.floor(total / 60).toString().padStart(2, "0");
    const ss = Math.floor(total % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

  const startGame = async () => {
    // Validate all items have content
    for (let i = 0; i < 4; i++) {
      const it = items[i];
      if (!it.question.trim() || !it.answer.trim()) return; // silently block if incomplete
    }
    // Save topic and questions to DB (fire and forget)
    setPersistError("");
    setSaving(true);
    try {
      const res = await fetch("/api/custom-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentTopicTitle.trim() || "Untitled",
          timerSeconds: initialSeconds,
          items: items.map((it) => ({
            question: it.question,
            hint1: it.hints[0] || undefined,
            hint2: it.hints[1] || undefined,
            hint3: it.hints[2] || undefined,
            answer: it.answer,
          })),
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to save topic");
      }
    } catch (e: any) {
      setPersistError(e?.message || "Failed to save topic");
      setSaving(false);
      return;
    }
    setSaving(false);
    setStageIndex(0);
    setAnswerInputs(["", "", "", ""]);
    setAnswerErrors(["", "", "", ""]);
    setAnsweredCorrect([false, false, false, false]);
    setOpenPanel(null);
    setRemaining(initialSeconds);
    setFlow("game");
    setRunning(true);
  };

  // Start game immediately without persisting to the database (used for Previous topic)
  const startGameImmediate = (itemsData: WizardItem[], seconds: number) => {
    const secs = Math.max(10, Math.min(3600, Number(seconds) || 300));
    setItems(itemsData);
    setPersistError("");
    setSaving(false);
    setStageIndex(0);
    setAnswerInputs(new Array(itemsData.length).fill(""));
    setAnswerErrors(new Array(itemsData.length).fill(""));
    setAnsweredCorrect(new Array(itemsData.length).fill(false));
    setOpenPanel(null);
    setInitialSeconds(secs);
    setRemaining(secs);
    setFlow("game");
    setRunning(true);
  };

  const restartAll = () => {
    setWizardStep(0);
    setItems([
      { question: "", hints: ["", "", ""], answer: "" },
      { question: "", hints: ["", "", ""], answer: "" },
      { question: "", hints: ["", "", ""], answer: "" },
      { question: "", hints: ["", "", ""], answer: "" },
    ]);
    setStageIndex(0);
    setAnswerInputs(["", "", "", ""]);
    setAnswerErrors(["", "", "", ""]);
    setAnsweredCorrect([false, false, false, false]);
    setOpenPanel(null);
    setRemaining(initialSeconds);
    setRunning(false);
    setFlow("mode");
    setMode("");
    setCurrentTopicTitle("");
    setModeError("");
  };

  const phaseBackground = (idx: number) => {
    switch (idx) {
      case 0: return "/images/phase1.png";
      case 1: return "/images/phase2.png";
      case 2: return "/images/phase3.png";
      case 3: return "/images/phase4.png";
      default: return baseBg;
    }
  };

  // Active hotspots for current phase
  const activeHotspots = PHASE_HOTSPOTS[stageIndex];

  // Load saved topics grouping by title
  useEffect(() => {
    if (flow !== "prevTopics") return;
    let cancelled = false;
    fetch("/api/custom-questions")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled) return;
        const topics = Array.isArray(data) ? data : [];
        const mapped = topics.map((t: any) => ({
          title: String(t?.title ?? ""),
          timerSeconds: Number(t?.timerSeconds ?? 300) || 300,
          items: (Array.isArray(t?.questions) ? t.questions : []).map((q: any) => ({
            question: String(q?.prompt ?? ""),
            answer: String(q?.answer ?? ""),
            hints: [String(q?.hint1 ?? ""), String(q?.hint2 ?? ""), String(q?.hint3 ?? "")],
          })),
        })).filter((t: any) => t.title);
        setSavedTopics(mapped);
        setSelectedTopicIndex(null);
      })
      .catch(() => setSavedTopics([]));
    return () => { cancelled = true; };
  }, [flow]);

  const handleSubmitAnswer = () => {
    const curr = answerInputs[stageIndex] || "";
    const expected = items[stageIndex].answer || "";
    if (normalize(curr) === normalize(expected)) {
      setAnsweredCorrect((prev) => prev.map((v, i) => (i === stageIndex ? true : v)));
      setAnswerErrors((prev) => prev.map((v, i) => (i === stageIndex ? "" : v)));
    } else {
      setAnswerErrors((prev) => prev.map((v, i) => (i === stageIndex ? "The answer is not correct." : v)));
    }
  };

  const goNextStage = () => {
    if (!answeredCorrect[stageIndex]) return;
    if (stageIndex < 3) {
      setStageIndex((i) => i + 1);
      setOpenPanel(null);
    } else {
      setRunning(false);
      setFlow("good");
    }
  };

  return (
    <div id="escape" className="relative w-full">
      <div className="relative w-screen max-w-none ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 sm:px-6 py-4">
        {
          flow === "mode" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(${baseBg})` }}
            >
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <div className="mx-4 w-full max-w-xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-center mb-6">Escape Room</h2>
                  <div className="space-y-3">
                    <button onClick={() => setFlow("topicName")} className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Create a question</button>
                    <button onClick={() => setFlow("prevTopics")} className="w-full px-4 py-3 rounded-md border border-white/40 hover:bg-white/10">Previous topic</button>
                  </div>
                </div>
              </div>
            </div>
          ) : flow === "customEntry" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(${baseBg})` }}
            >
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <div className="mx-4 w-full max-w-md bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-center mb-6">Custom Questions</h2>
                  <div className="space-y-3">
                    <button onClick={() => setFlow("topicName")} className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Create a question</button>
                    <button onClick={() => setFlow("prevTopics")} className="w-full px-4 py-3 rounded-md border border-white/40 hover:bg-white/10">Previous topic</button>
                  </div>
                  <div className="mt-6 text-right">
                    <button onClick={() => setFlow("mode")} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
                  </div>
                </div>
              </div>
            </div>
          ) : flow === "topicName" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(${baseBg})` }}
            >
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <form onSubmit={(e) => { e.preventDefault(); if (!currentTopicTitle.trim()) { setModeError("Please enter a topic name."); return; } setModeError(""); setItems([{ question: "", hints: ["", "", ""], answer: "" }, { question: "", hints: ["", "", ""], answer: "" }, { question: "", hints: ["", "", ""], answer: "" }, { question: "", hints: ["", "", ""], answer: "" }]); setFlow("wizard"); }} className="mx-4 w-full max-w-lg bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-center mb-4">Create topic</h2>
                  <label className="block text-sm mb-1">Topic name</label>
                  <input value={currentTopicTitle} onChange={(e) => setCurrentTopicTitle(e.target.value)} placeholder="e.g., History" className="w-full mb-3 px-3 py-2 rounded-md bg-black/60 text-white border border-white/30 outline-none" />
                  {modeError && <div className="text-red-400 text-sm mb-3" role="alert">{modeError}</div>}
                  <div className="flex justify-between mt-2">
                    <button type="button" onClick={() => setFlow("customEntry")} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
                    <button type="submit" className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Next</button>
                  </div>
                </form>
              </div>
            </div>
          ) : flow === "wizard" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(${baseBg})` }}
            >
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <form
                  className="mx-4 w-full max-w-3xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm"
                  onSubmit={(e) => { e.preventDefault(); if (wizardStep < 3) { setWizardStep(wizardStep + 1); } }}
                >
                  <h2 className="text-xl font-bold text-center mb-4">Write question for your topic</h2>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm opacity-80">Question {wizardStep + 1} of 4</div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm opacity-80">Timer (s)</label>
                      <input
                        type="number"
                        min={10}
                        max={3600}
                        value={initialSeconds}
                        onChange={(e) => setInitialSeconds(Math.max(10, Math.min(3600, Number(e.target.value) || 10)))}
                        className="w-28 px-2 py-1 rounded-md bg-black/60 text-white border border-white/30 outline-none"
                      />
                    </div>
                  </div>
                  {persistError && <div className="text-red-400 text-sm mb-3" role="alert">{persistError}</div>}

                  <label className="block text-sm mb-1">Question</label>
                  <textarea
                    rows={3}
                    value={items[wizardStep].question}
                    onChange={(e) => {
                      const text = e.target.value;
                      setItems((prev) => prev.map((it, i) => (i === wizardStep ? { ...it, question: text } : it)));
                    }}
                    placeholder="Type your question"
                    className="w-full mb-4 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    {[0,1,2].map((h) => (
                      <div key={h} className="flex flex-col">
                        <label className="block text-sm mb-1">Hint {h+1}</label>
                        <input
                          type="text"
                          value={items[wizardStep].hints[h]}
                          onChange={(e) => {
                            const text = e.target.value;
                            setItems((prev) => prev.map((it, i) => {
                              if (i !== wizardStep) return it;
                              const nh = [...it.hints] as [string, string, string];
                              nh[h] = text;
                              return { ...it, hints: nh };
                            }));
                          }}
                          placeholder={`Enter hint ${h+1}`}
                          className="w-full px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <label className="block text-sm mb-1">Answer</label>
                  <input
                    type="text"
                    value={items[wizardStep].answer}
                    onChange={(e) => setItems((prev) => prev.map((it, i) => (i === wizardStep ? { ...it, answer: e.target.value } : it)))}
                    placeholder="Type the answer"
                    className="w-full mb-6 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
                  />

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (wizardStep === 0) {
                          setFlow("topicName");
                        } else {
                          setWizardStep((s) => Math.max(0, s - 1));
                        }
                      }}
                      className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10"
                    >
                      Back
                    </button>

                    {wizardStep < 3 ? (
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20"
                        disabled={!items[wizardStep].question.trim() || !items[wizardStep].answer.trim()}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startGame}
                        className="px-5 py-2.5 rounded-md bg-[--foreground] text-[--background] border border-white/0 hover:opacity-90"
                        disabled={saving || items.some((it) => !it.question.trim() || !it.answer.trim())}
                      >
                        {saving ? "Saving..." : "Start"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : flow === "prevTopics" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(${baseBg})` }}
            >
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <div className="mx-4 w-full max-w-2xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-center mb-4">Previous topics</h2>
                  {savedTopics.length === 0 ? (
                    <div className="text-sm opacity-80">No topics saved yet.</div>
                  ) : (
                    <ul className="space-y-2">
                      {savedTopics.map((t, idx) => (
                        <li key={idx} className={`rounded-md border ${selectedTopicIndex === idx ? "border-white bg-white/10" : "border-white/20"}`}>
                          <button onClick={() => setSelectedTopicIndex((cur) => (cur === idx ? null : idx))} className="w-full text-left px-4 py-3">
                            <div className="font-semibold">{t.title}</div>
                            <div className="text-sm opacity-80">{t.items.length} questions</div>
                          </button>
                          {selectedTopicIndex === idx && (
                            <div className="px-4 pb-3">
                              <div className="text-sm opacity-80 mb-2">Preview:</div>
                              <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
                                {t.items.map((it, qi) => (
                                  <li key={qi}>{it.question}</li>
                                ))}
                              </ul>
                              <div className="mt-3 flex gap-2">
                                <button
                                  className="px-4 py-2 rounded-md bg-white/10 border border-white/40 hover:bg-white/20"
                                  onClick={() => {
                                    const padded = [0,1,2,3].map((i) => t.items[i] ? t.items[i] : { question: "", answer: "", hints: ["", "", ""] as [string,string,string] });
                                    const itemsData: WizardItem[] = padded.map((it) => ({ question: it.question, hints: it.hints, answer: it.answer }));
                                    const secs = Math.max(10, Math.min(3600, Number(t.timerSeconds || 300)));
                                    setCurrentTopicTitle(t.title);
                                    startGameImmediate(itemsData, secs);
                                  }}
                                >Use this topic</button>
                                <button
                                  className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10"
                                  onClick={async () => {
                                    try {
                                      await fetch(`/api/custom-questions?title=${encodeURIComponent(t.title)}`, { method: "DELETE" });
                                      setSavedTopics((prev) => prev.filter((_, i) => i !== idx));
                                      setSelectedTopicIndex(null);
                                    } catch {}
                                  }}
                                >Delete</button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-6 text-right">
                    <button onClick={() => setFlow("customEntry")} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
                  </div>
                </div>
              </div>
            </div>
          ) : flow === "game" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(${phaseBackground(stageIndex)})` }}
            >
              <div className="absolute" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh]">
                {/* Floating timer cluster (top-left) */}
                <div className="absolute top-4 left-4 z-10 text-white select-none">
                  <div className="flex items-center gap-3">
                    {/* Circular timer */}
                    <div className="relative">
                      <div className="size-[104px] rounded-full bg-black/50 ring-4 ring-white/80 flex flex-col items-center justify-center shadow-xl">
                        <div className="text-sm tracking-[0.2em] opacity-90 mb-0.5">TIME</div>
                        <div className="text-3xl font-extrabold tabular-nums">{formatTime(remaining)}</div>
                      </div>
                      {/* Decorative red arc */}
                      <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-red-500 border-l-red-500 rotate-[-45deg] pointer-events-none"></div>
                    </div>
                    {/* Pause/Resume circular button */}
                    <button
                      type="button"
                      onClick={() => setRunning((r) => !r)}
                      className="size-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center text-white hover:bg-white/30 shadow-lg"
                      aria-label={running ? "Pause timer" : "Resume timer"}
                      title={running ? "Pause" : "Resume"}
                    >
                      <span className="text-xl font-bold leading-none">{running ? "Ⅱ" : "▶"}</span>
                    </button>
                  </div>
                </div>

                {/* Hotspots overlay: use positions if available; otherwise show ground box */}
                {activeHotspots ? (
                  <div className="absolute inset-0">
                    {/* Hint buttons on the box (right) */}
                    {(activeHotspots?.hints || []).map((pos, i) => (
                      <button
                        key={`h1-${i}`}
                        type="button"
                        onClick={() => setOpenPanel((`hint${i+1}`) as any)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
                        style={{ top: pos.top, left: pos.left }}
                        aria-label={`Hint ${i+1}`}
                        title={`Hint ${i+1}`}
                      >
                        <span>👁️</span>
                      </button>
                    ))}
                    {/* Lock button on the door (center) */}
                    <button
                      type="button"
                      onClick={() => setOpenPanel("qa")}
                      className="absolute -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
                      style={{ top: activeHotspots?.lock.top, left: activeHotspots?.lock.left }}
                      aria-label="Question and Answer"
                      title="Question and Answer"
                    >
                      <span>🔒</span>
                    </button>
                    {/* Next arrow appears near right-bottom when correct */}
                    {answeredCorrect[stageIndex] && (
                      <button
                        type="button"
                        onClick={goNextStage}
                        className="absolute right-6 bottom-6 size-12 rounded-full bg-white/20 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/30"
                        aria-label="Next phase"
                        title="Next phase"
                      >
                        ➡️
                      </button>
                    )}
                  </div>
                ) : (
                  // Default: controls box on the ground for other phases
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[min(720px,92%)]">
                    <div className="absolute -bottom-3 left-8 right-8 h-4 bg-black/50 blur-md rounded-full" aria-hidden="true"></div>
                    <div className="relative rounded-xl bg-black/55 border border-white/25 backdrop-blur-sm px-4 py-3 shadow-[0_12px_28px_rgba(0,0,0,0.6)]">
                      <div className="flex items-center justify-center gap-4">
                        {["hint1", "hint2", "hint3"].map((key, i) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setOpenPanel(key as any)}
                            className="size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
                            aria-label={`Hint ${i+1}`}
                            title={`Hint ${i+1}`}
                          >
                            <span>👁️</span>
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setOpenPanel("qa")}
                          className="size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
                          aria-label="Question and Answer"
                          title="Question and Answer"
                        >
                          <span>🔒</span>
                        </button>
                        {answeredCorrect[stageIndex] && (
                          <button
                            type="button"
                            onClick={goNextStage}
                            className="size-12 rounded-full bg-white/20 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/30"
                            aria-label="Next phase"
                            title="Next phase"
                          >
                            ➡️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating panel */}
                {openPanel && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-10 z-30 pointer-events-auto">
                    {openPanel === "qa" ? (
                      <div
                        className="relative inline-block shadow-2xl"
                        style={{ width: 'min(98vw, 1400px)' }}
                      >
                        {/* Paper look: use oldPaper as background. Inputs are dark-on-light to match. */}
                        <div
                          className="relative"
                          style={{
                            width: 'min(98vw, 1400px)',
                            minHeight: 'min(82vh, 820px)',
                            backgroundImage: 'url(/images/oldPaper.png)',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                          }}
                        >

                          {/* Content inside paper margins */}
                          <div className="absolute inset-0 pt-16 pb-12 text-black flex items-start justify-center px-[6%] sm:px-[8%]">
                            <div className="mx-auto" style={{ width: 'min(860px, 45%)' }}>
                              <div className="text-xl font-semibold mb-3">Question</div>
                              <div className="mb-4 whitespace-pre-wrap text-[15px] leading-relaxed bg-white/70 border border-black/10 rounded-md p-3 w-full">{items[stageIndex].question}</div>
                              <label className="block text-sm mb-1">Your answer</label>
                              <input
                                type="text"
                                value={answerInputs[stageIndex]}
                                onChange={(e) => setAnswerInputs((prev) => prev.map((v, i) => (i === stageIndex ? e.target.value : v)))}
                                className="w-full px-3 py-2 rounded-md bg-white/85 text-black border border-black/20 outline-none placeholder:text-black/60 focus:ring-2 focus:ring-purple-300"
                                placeholder="Type your answer"
                              />
                              {answerErrors[stageIndex] && (
                                <div className="text-red-700 text-sm mt-2" role="alert">{answerErrors[stageIndex]}</div>
                              )}
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <button
                                  type="button"
                                  onClick={() => setOpenPanel(null)}
                                  className="px-4 py-2 rounded-md border border-black/30 bg-white/70 hover:bg-white/80 text-black"
                                >
                                  Close
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSubmitAnswer}
                                  className="px-5 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 shadow"
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative inline-block shadow-2xl"
                        style={{ width: 'min(98vw, 1400px)' }}
                      >
                        <div
                          className="relative"
                          style={{
                            width: 'min(98vw, 1400px)',
                            minHeight: 'min(82vh, 820px)',
                            backgroundImage: 'url(/images/oldPaper.png)',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div className="absolute inset-0 pt-16 pb-12 text-black flex items-start justify-center px-[6%] sm:px-[8%]">
                            <div className="mx-auto" style={{ width: 'min(860px, 45%)' }}>
                              <div className="text-xl font-semibold mb-3">Hint</div>
                              <div className="whitespace-pre-wrap text-[15px] leading-relaxed bg-white/70 border border-black/10 rounded-md p-3 w-full">{openPanel === "hint1" ? items[stageIndex].hints[0] : openPanel === "hint2" ? items[stageIndex].hints[1] : items[stageIndex].hints[2]}</div>
                              <div className="mt-4 flex items-center justify-start gap-3">
                                <button type="button" onClick={() => setOpenPanel(null)} className="px-4 py-2 rounded-md border border-black/30 bg-white/70 hover:bg-white/80 text-black">Close</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Fullscreen pause overlay */}
                {!running && flow === "game" && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                    <button
                      type="button"
                      onClick={() => setRunning(true)}
                      className="w-40 h-40 rounded-full bg-white/15 border-4 border-white/80 flex items-center justify-center hover:bg-white/25 shadow-2xl"
                      aria-label="Resume game"
                    >
                      <span className="text-5xl">▶</span>
                    </button>
                    <div className="mt-6 text-2xl font-semibold">GAME HAS BEEN PAUSED</div>
                    <div className="mt-2 text-sm opacity-80">Press the button to resume</div>
                  </div>
                )}
              </div>
            </div>
          ) : flow === "bad" ? (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(/images/badEnding.png)` }}
            >
              <div className="absolute" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <div className="mx-4 w-full max-w-xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-8 text-center backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-2">You are dead</h2>
                  <p className="opacity-80 mb-6">A hero never gives up</p>
                  <div className="flex flex-col gap-3 items-center">
                    <button onClick={restartAll} className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Restart</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
              style={{ backgroundImage: `url(/images/goodEnding.png)` }}
            >
              <div className="absolute" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <div className="mx-4 w-full max-w-xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-8 text-center backdrop-blur-sm">
                  <h2 className="text-2xl font-bold mb-2">You have escaped the dungeon</h2>
                  <div className="flex flex-col gap-3 items-center">
                    <a href="/" className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Back to Home</a>
                    <button onClick={restartAll} className="px-5 py-2.5 rounded-md border border-white/40 hover:bg-white/10">Play again</button>
                  </div>
                </div>
              </div>
            </div>
          )
        };
      </div>
    </div>
  );
}

