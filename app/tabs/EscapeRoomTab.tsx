import React, { useEffect, useMemo, useState } from "react";

export default function EscapeRoomTab(): JSX.Element {
  const backgroundImageUrl = useMemo(() => {
    // Prefer the file under /public/images, fallback to root if user moved it
    return "/images/escaperoom.png";
  }, []);

  const [name, setName] = useState<string>("");
  const [seconds, setSeconds] = useState<string>("300");
  const [error, setError] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Flow: mode -> topic -> questions -> setup -> game -> result
  const [flowStep, setFlowStep] = useState<"mode" | "topic" | "questions" | "setup" | "game" | "result">("mode");
  const [mode, setMode] = useState<"default" | "custom" | "">("");
  type QA = { topic: string; question: string; answer: string };
  const [customItems, setCustomItems] = useState<QA[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [modeError, setModeError] = useState<string>("");
  const [savedTopics, setSavedTopics] = useState<Array<{ title: string; items: { question: string; answer: string }[] }>>([]);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);
  // Default stages used when mode === 'default'
  const defaultStages = useMemo(() => [
    {
      title: "Stage 1: Format code correctly",
      description: "Format the following JavaScript exactly. Target: `const x = [1, 2, 3];`",
      promptLabel: "Unformatted snippet:",
      preset: "const x=[1,2,3]",
    },
    {
      title: "Stage 2: Name variables clearly",
      description: "Rename variables to be descriptive without changing behavior.",
      promptLabel: "Original snippet:",
      preset: "function f(a,b){return a+b}",
    },
    {
      title: "Stage 3: Fix a small bug",
      description: "Correct the function so it returns the proper result.",
      promptLabel: "Buggy snippet:",
      preset: "const isEven=n=>n%2===1",
    },
    {
      title: "Stage 4: Refactor for readability",
      description: "Refactor the code into a clean, readable form.",
      promptLabel: "Refactor this:",
      preset: "if(flag){doA()}else{doA()}",
    },
  ], []);
  // Game stages are derived from selection
  const [gameStages, setGameStages] = useState<Array<{ title: string; description: string; promptLabel: string; preset: string }>>([]);
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [expectedAnswers, setExpectedAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<"none" | "lose" | "win">("none");

  const parsedInitialSeconds = useMemo(() => Math.min(3600, Math.max(10, Number(seconds) || 300)), [seconds]);
  const [remaining, setRemaining] = useState<number>(parsedInitialSeconds);
  const [running, setRunning] = useState<boolean>(false);
  const [hintsLeft, setHintsLeft] = useState<number>(3);

  useEffect(() => {
    if (!submitted) return;
    setRemaining(parsedInitialSeconds);
  }, [submitted, parsedInitialSeconds]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  // Auto-lose when time runs out and player is still in the game screen
  useEffect(() => {
    if (flowStep === "game" && remaining === 0) {
      setRunning(false);
      setResult("lose");
      setFlowStep("result");
    }
  }, [remaining, flowStep]);

  const formatTime = (total: number) => {
    const mm = Math.floor(total / 60).toString().padStart(2, "0");
    const ss = Math.floor(total % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

  const restart = () => {
    setFlowStep("mode");
    setMode("");
    setCustomItems([]);
    setModeError("");
    setSubmitted(false);
    setName("");
    setSeconds("300");
    setError("");
    setGameStages([]);
    setAnswers([]);
    setExpectedAnswers([]);
    setStageIndex(0);
    setHintsLeft(3);
    setRunning(false);
    setRemaining(300);
    setResult("none");
  };

  const onStart = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = name.trim();
    const value = Number(seconds);
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (!Number.isFinite(value) || Number.isNaN(value)) {
      setError("Timer must be a number between 10 and 3600 seconds.");
      return;
    }
    if (value < 10 || value > 3600) {
      setError("Timer must be between 10 and 3600 seconds.");
      return;
    }
    // Build stages based on mode
    if (mode === "default") {
      setGameStages(defaultStages);
      setAnswers(defaultStages.map(() => ""));
      setExpectedAnswers([]);
    } else if (mode === "custom") {
      const valid = customItems.filter((q) => q.topic.trim() || q.question.trim());
      if (valid.length === 0) {
        setError("Please add at least one custom question.");
        return;
      }
      if (valid.some((q) => !q.question.trim() || !q.answer.trim())) {
        setError("Please provide answers for all custom questions.");
        return;
      }
      const built = valid.map((q, i) => ({
        title: q.topic.trim() ? q.topic.trim() : `Stage ${i + 1}`,
        description: "Answer the question below.",
        promptLabel: "Question:",
        preset: q.question.trim(),
      }));
      setGameStages(built);
      setAnswers(built.map(() => ""));
      setExpectedAnswers(valid.map((q) => q.answer.trim()));
    } else {
      setError("Please choose Default or Custom questions.");
      return;
    }
    setSubmitted(true);
    setFlowStep("game");
    setRunning(false);
  };

  const proceedFromMode = (e: React.FormEvent) => {
    e.preventDefault();
    setModeError("");
    if (mode === "") {
      setModeError("Please choose an option to continue.");
      return;
    }
    // If a saved topic is chosen, adopt it immediately and skip topic/questions screens
    if (
      mode === "custom" &&
      selectedTopicIndex !== null &&
      savedTopics[selectedTopicIndex]
    ) {
      const topic = savedTopics[selectedTopicIndex];
      setCustomItems(topic.items.map((it) => ({ topic: topic.title, question: it.question, answer: it.answer })));
      setFlowStep("setup");
      return;
    }
    setFlowStep(mode === "custom" ? "topic" : "setup");
  };

  const addCustomItem = () => {
    setCustomItems((prev) => [...prev, { topic: prev[0]?.topic || (customItems[0]?.topic ?? ""), question: "", answer: "" }]);
  };
  const removeCustomItem = (index: number) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addTopic = () => {
    const t = currentTopic.trim();
    if (!t) return;
    setCustomItems((prev) => [...prev, { topic: t, question: "", answer: "" }]);
    setCurrentTopic("");
  };

  // Load previously saved topics when the user selects custom mode (preview only)
  useEffect(() => {
    if (mode !== "custom") return;
    let cancelled = false;
    fetch("/api/custom-questions")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (cancelled) return;
        const titleToItems = new Map<string, { question: string; answer: string }[]>();
        (data || []).forEach((set: any) => {
          (set?.topics || []).forEach((t: any) => {
            if (!t?.title || !t?.question) return;
            const title = String(t.title);
            const item = { question: String(t.question), answer: String(t.answer ?? "") };
            const arr = titleToItems.get(title) ?? [];
            if (!arr.some((x) => x.question === item.question)) arr.push(item);
            titleToItems.set(title, arr);
          });
        });
        setSavedTopics(Array.from(titleToItems.entries()).map(([title, items]) => ({ title, items })));
        setSelectedTopicIndex(null);
      })
      .catch(() => {
        setSavedTopics([]);
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  // Persist the custom set to the database (author optional)
  const saveCurrentCustomSet = async (): Promise<void> => {
    try {
      const items = customItems
        .filter((it) => it.question.trim() && it.answer.trim())
        .map((it, idx) => ({
          title: it.topic || `Stage ${idx + 1}`,
          question: it.question,
          answer: it.answer,
        }));
      if (items.length === 0) return;
      const res = await fetch("/api/custom-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: name.trim() || "anonymous", items }),
      });
      if (!res.ok) return;
      const created = await res.json();
      if (created?.topics) {
        setSavedTopics((prev) => {
          const map = new Map<string, { question: string; answer: string }[]>();
          prev.forEach((g) => map.set(g.title, [...g.items]));
          created.topics.forEach((t: any) => {
            const title = String(t.title);
            const item = { question: String(t.question), answer: String(t.answer ?? "") };
            const arr = map.get(title) ?? [];
            if (!arr.some((x) => x.question === item.question)) arr.push(item);
            map.set(title, arr);
          });
          return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
        });
      }
    } catch {
      // ignore network errors for now
    }
  };

  return (
    <div id="escape" className="relative w-full">
      {/* Full-bleed wrapper with comfortable spacing */}
      <div className="relative w-screen max-w-none ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 sm:px-6 py-4">
        {/* Background image card */}
        <div
          className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          {/* Darken the background more for higher contrast */}
          <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>

          {/* Content */}
          <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
            {flowStep === "mode" ? (
              <form onSubmit={proceedFromMode} className="mx-4 w-full max-w-2xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-center mb-4">Escape Room</h2>
                <div className="mb-4 text-base">Choose question set</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setMode("default")}
                    className={`rounded-md border px-4 py-3 text-left ${mode === "default" ? "border-white bg-white/10" : "border-white/30 hover:bg-white/5"}`}
                  >
                    <div className="font-semibold mb-1">Default questions</div>
                    <div className="text-sm opacity-80">Use the preset 4 stages.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("custom")}
                    className={`rounded-md border px-4 py-3 text-left ${mode === "custom" ? "border-white bg-white/10" : "border-white/30 hover:bg-white/5"}`}
                  >
                    <div className="font-semibold mb-1">Create your own</div>
                    <div className="text-sm opacity-80">Write your own questions and answers.</div>
                  </button>
                </div>

                {mode === "custom" && (
                  <div className="mt-2">
                    <div className="text-base mb-2">Your topics</div>
                    {savedTopics.length === 0 ? (
                      <div className="text-sm opacity-70">No saved topics yet. Create some to see them here.</div>
                    ) : (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {savedTopics.map((t, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedTopicIndex((cur) => (cur === idx ? null : idx))}
                              className={`px-2.5 py-1 rounded-full border ${selectedTopicIndex === idx ? "border-white bg-white/10" : "border-white/30 hover:bg-white/5"}`}
                            >
                              {t.title}
                            </button>
                          ))}
                        </div>
                        {selectedTopicIndex !== null && savedTopics[selectedTopicIndex] && (
                          <div className="rounded-md border border-white/20 p-3 bg-black/40">
                            <div className="font-semibold mb-2">{savedTopics[selectedTopicIndex]?.title}</div>
                            <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                              {(savedTopics[selectedTopicIndex]?.items ?? []).map((it, qi) => (
                                <li key={qi}>{it.question}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {modeError && <div className="text-red-400 text-sm mb-3" role="alert">{modeError}</div>}

                <div className={`flex items-center ${mode === "custom" && selectedTopicIndex !== null && savedTopics[selectedTopicIndex] ? "justify-between" : "justify-end"}`}>
                  {mode === "custom" && selectedTopicIndex !== null && savedTopics[selectedTopicIndex] && (
                    <button
                      type="button"
                      onClick={async () => {
                        const topic = savedTopics[selectedTopicIndex!];
                        try {
                          await fetch(`/api/custom-questions?title=${encodeURIComponent(topic.title)}`, { method: "DELETE" });
                          setSavedTopics((prev) => prev.filter((_, i) => i !== selectedTopicIndex));
                          setSelectedTopicIndex(null);
                        } catch {
                          // ignore for now
                        }
                      }}
                      className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10"
                    >
                      Remove topic
                    </button>
                  )}
                  <button
                    type="submit"
                    onClick={() => {
                      if (mode === "custom" && selectedTopicIndex !== null && savedTopics[selectedTopicIndex]) {
                        const topic = savedTopics[selectedTopicIndex];
                        setCustomItems(topic.items.map((it) => ({ topic: topic.title, question: it.question, answer: it.answer })));
                      }
                    }}
                    className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20"
                  >
                    {mode === "custom" && selectedTopicIndex !== null && savedTopics[selectedTopicIndex] ? "Use topic" : "Continue"}
                  </button>
                </div>
              </form>
            ) : flowStep === "topic" ? (
              <form onSubmit={(e) => { e.preventDefault(); const t = currentTopic.trim(); if (!t && customItems.length === 0) { setModeError("Please enter a topic to continue."); return; } if (t) { setCustomItems((prev) => [...prev, { topic: t, question: "", answer: "" }]); setCurrentTopic(""); } setModeError(""); setFlowStep("questions"); }} className="mx-4 w-full max-w-2xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-center mb-4">Create your topics</h2>
                <div className="mb-4">Enter the topic for your custom stage.</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTopic}
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    placeholder="e.g., Hobbies, Math, History"
                    className="flex-1 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
                  />
                </div>
                {/* Intentionally hide created topic chips on this screen */}
                {modeError && <div className="text-red-400 text-sm mt-3" role="alert">{modeError}</div>}
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFlowStep("mode"); }} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
                  <button type="submit" className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Next</button>
                </div>
              </form>
            ) : flowStep === "questions" ? (
              <form onSubmit={async (e) => { e.preventDefault(); if (customItems.length === 0) { setModeError("Please add at least one topic."); return; } if (customItems.every((it) => !it.question.trim())) { setModeError("Add at least one question."); return; } await saveCurrentCustomSet(); setFlowStep("setup"); }} className="mx-4 w-full max-w-3xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-center mb-4">Write questions for your topic</h2>
                <div className="text-base opacity-80 mb-4">Topic: <span className="font-semibold opacity-100">{customItems[0]?.topic || "(untitled)"}</span></div>
                <div className="space-y-4">
                  {customItems.map((item, idx) => (
                    <div key={idx} className="rounded-md border border-white/20 p-4 bg-black/40">
                      <label className="block text-sm mb-1">Question {idx + 1}</label>
                      <textarea
                        rows={3}
                        value={item.question}
                        onChange={(e) => setCustomItems((prev) => prev.map((it, i) => i === idx ? { ...it, question: e.target.value } : it))}
                        placeholder="Type your question"
                        className="w-full mb-3 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
                      />
                      <label className="block text-sm mb-1">Answer</label>
                      <input
                        type="text"
                        value={item.answer}
                        onChange={(e) => setCustomItems((prev) => prev.map((it, i) => i === idx ? { ...it, answer: e.target.value } : it))}
                        placeholder="Type the expected answer"
                        className="w-full px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
                      />
                      <div className="mt-3 text-right">
                        <button type="button" onClick={() => removeCustomItem(idx)} className="px-3 py-1 rounded-md border border-white/30 hover:bg-white/10">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button type="button" onClick={() => setFlowStep("topic")} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
                  <button type="button" onClick={addCustomItem} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Add question</button>
                  <button type="submit" className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Next</button>
                </div>
              </form>
            ) : flowStep === "setup" ? (
              <form
                onSubmit={onStart}
                className="mx-4 w-full max-w-md bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold text-center mb-4">Escape Room</h2>

                <label className="block text-sm mb-1" htmlFor="playerName">Enter your name</label>
                <input
                  id="playerName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="your name"
                  className="w-full mb-4 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/40 focus:border-white focus:ring-2 focus:ring-white/40 outline-none"
                />

                <label className="block text-sm mb-1" htmlFor="seconds">
                  Set timer (seconds 10 - 3600)
                </label>
                <input
                  id="seconds"
                  type="number"
                  inputMode="numeric"
                  min={10}
                  max={3600}
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full mb-4 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/40 focus:border-white focus:ring-2 focus:ring-white/40 outline-none"
                />

                {error && (
                  <div className="text-red-400 text-sm mb-3" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2 rounded-md bg-[--foreground] text-[--background] font-semibold hover:opacity-90 transition"
                >
                  Start Game
                </button>
              </form>
            ) : flowStep === "result" ? (
              <div className="mx-4 w-full max-w-xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-8 text-center backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-3">{result === "lose" ? "You are a loser" : "You escaped!"}</h2>
                <p className="opacity-80 mb-6">{result === "lose" ? "Your answers did not match the author's." : "Great job finishing the stages."}</p>
                <button onClick={restart} className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Restart</button>
              </div>
            ) : (
              <div className="mx-4 w-full max-w-7xl xl:max-w-[88rem] grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-8">
                {/* Left: stage content */}
                <div className="bg-[--background]/70 border border-white/10 rounded-xl p-6 lg:p-8 text-white backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-base opacity-80">Stage {stageIndex + 1} of {gameStages.length}</div>
                    <div className="text-base opacity-80">{running ? "In progress" : "Paused"}</div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{gameStages[stageIndex]?.title}</h3>
                  <p className="text-base mb-5 opacity-90">{gameStages[stageIndex]?.description}</p>

                  <div className="text-base mb-2 opacity-80">{gameStages[stageIndex]?.promptLabel}</div>
                  <input
                    readOnly
                    value={gameStages[stageIndex]?.preset || ""}
                    className="w-full mb-4 px-4 py-3 rounded-md bg-black/50 text-white text-base border border-white/30 outline-none"
                  />
                  <textarea
                    value={answers[stageIndex]}
                    onChange={(e) => {
                      const text = e.target.value;
                      setAnswers((prev) => prev.map((v, i) => (i === stageIndex ? text : v)));
                    }}
                    placeholder={mode === "custom" ? "Type your answer here" : "Type the correctly formatted code here"}
                    rows={10}
                    className="w-full px-4 py-3 rounded-md bg-black/50 text-white text-base border border-white/30 outline-none"
                  />

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      className="px-5 py-2.5 rounded-md border border-white/40 text-white hover:bg-white/10"
                      onClick={() => setStageIndex((i) => Math.max(0, i - 1))}
                      disabled={stageIndex === 0}
                      type="button"
                    >
                      Previous
                    </button>
                    <button
                      className="ml-auto px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20"
                      onClick={() => {
                        if (stageIndex < gameStages.length - 1) {
                          setStageIndex((i) => i + 1);
                        } else {
                          setRunning(false);
                          if (mode === "custom") {
                            const mismatched = expectedAnswers.some((exp, i) => normalize(exp) !== normalize(answers[i] || ""));
                            if (mismatched) {
                              setResult("lose");
                              setFlowStep("result");
                            } else {
                              setResult("win");
                              setFlowStep("result");
                            }
                          } else {
                            setResult("win");
                            setFlowStep("result");
                          }
                        }
                      }}
                      type="button"
                    >
                      {stageIndex < gameStages.length - 1 ? "Submit" : "Finish"}
                    </button>
                  </div>
                </div>

                {/* Right: controls */}
                <aside className="bg-[--background]/70 border border-white/10 rounded-xl p-6 lg:p-8 text-white backdrop-blur-sm">
                  <div className="text-base opacity-80 mb-3">Player: <span className="font-medium opacity-100">{name.trim()}</span></div>
                  <div className="text-4xl lg:text-5xl font-bold mb-4">{formatTime(remaining)}</div>

                  <div className="flex items-center gap-2 mb-4">
                    <button
                      className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10"
                      onClick={() => setRunning(true)}
                      type="button"
                    >
                      Start
                    </button>
                    <button
                      className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10"
                      onClick={() => setRunning(false)}
                      type="button"
                    >
                      Pause
                    </button>
                    <button
                      className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10"
                      onClick={() => { setRunning(false); setRemaining(parsedInitialSeconds); }}
                      type="button"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="text-base opacity-80 mb-3">Hints remaining: {hintsLeft}</div>
                  <button
                    className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10 disabled:opacity-50"
                    onClick={() => setHintsLeft((h) => Math.max(0, h - 1))}
                    disabled={hintsLeft <= 0}
                    type="button"
                  >
                    Get hint
                  </button>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


