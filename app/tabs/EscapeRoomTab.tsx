import React, { useEffect, useMemo, useState } from "react";
import { TimerOverlay, ControlsBox, HotspotsOverlay, PhaseImage, ModeLanding, TopicNameForm, PrevTopicsList, WizardForm } from "../tabs/escape-room/components";
import useTimer from "../hooks/useTimer";
import useEscapeRoomState from "../hooks/useEscapeRoomState";
import { getTopics, createTopic, deleteTopic } from "../services/customQuestionsClient";
import { WizardItem, Flow } from "../types/escapeRoom";
import { PHASE_HOTSPOTS } from "../constants/hotspots";

export default function EscapeRoomTab(): JSX.Element {
  const baseBg = useMemo(() => "/images/backGround.png", []);

  // Wizard for 4 questions
  const [wizardStep, setWizardStep] = useState<number>(0); // 0..3
  const [items, setItems] = useState<WizardItem[]>([
    { question: "", hints: ["", "", ""], answer: "" },
    { question: "", hints: ["", "", ""], answer: "" },
    { question: "", hints: ["", "", ""], answer: "" },
    { question: "", hints: ["", "", ""], answer: "" },
  ]);

  const [flow, setFlow] = useState<Flow>("mode");
  const [mode, setMode] = useState<"default" | "custom" | "">("");
  const [currentTopicTitle, setCurrentTopicTitle] = useState<string>("");
  const [modeError, setModeError] = useState<string>("");

  // Game state
  const {
    stageIndex, setStageIndex,
    openPanel, setOpenPanel,
    answerInputs, setAnswerInputs,
    answerErrors, setAnswerErrors,
    answeredCorrect, setAnsweredCorrect,
    submitAnswer,
  } = useEscapeRoomState();

  // Timer
  const [initialSeconds, setInitialSeconds] = useState<number>(300);
  const { remaining, running, setRunning, setRemaining } = useTimer(300);
  const [saving, setSaving] = useState<boolean>(false);
  const [persistError, setPersistError] = useState<string>("");

  // Saved topics fetched from API when needed
  const [savedTopics, setSavedTopics] = useState<Array<{ title: string; timerSeconds: number; items: { question: string; answer: string; hints: [string, string, string] }[] }>>([]);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null);

  useEffect(() => { setRemaining(initialSeconds); }, [initialSeconds, setRemaining]);

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
      await createTopic({
        title: currentTopicTitle.trim() || "Untitled",
        timerSeconds: initialSeconds,
        items: items.map((it) => ({
          question: it.question,
          hint1: it.hints[0] || undefined,
          hint2: it.hints[1] || undefined,
          hint3: it.hints[2] || undefined,
          answer: it.answer,
        })),
      });
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
    getTopics()
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
            <div className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden" style={{ backgroundImage: `url(${baseBg})` }}>
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <ModeLanding onCreateQuestion={() => setFlow("topicName")} onPrevTopics={() => setFlow("prevTopics")} />
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
            <div className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden" style={{ backgroundImage: `url(${baseBg})` }}>
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <TopicNameForm
                  value={currentTopicTitle}
                  onChange={(v) => setCurrentTopicTitle(v)}
                  onBack={() => setFlow("customEntry")}
                  onNext={() => { if (!currentTopicTitle.trim()) { setModeError("Please enter a topic name."); return; } setModeError(""); setItems([{ question: "", hints: ["", "", ""], answer: "" }, { question: "", hints: ["", "", ""], answer: "" }, { question: "", hints: ["", "", ""], answer: "" }, { question: "", hints: ["", "", ""], answer: "" }]); setFlow("wizard"); }}
                  error={modeError}
                />
              </div>
            </div>
          ) : flow === "wizard" ? (
            <div className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden" style={{ backgroundImage: `url(${baseBg})` }}>
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <WizardForm
                  items={items}
                  step={wizardStep}
                  timerSeconds={initialSeconds}
                  error={persistError}
                  onTimerChange={(n) => setInitialSeconds(n)}
                  onChangeItem={(idx, item) => setItems((prev) => prev.map((it, i) => (i === idx ? item : it)))}
                  onBack={() => { if (wizardStep === 0) setFlow("topicName"); else setWizardStep((s) => Math.max(0, s - 1)); }}
                  onNext={() => { if (wizardStep < items.length - 1) setWizardStep((s) => s + 1); }}
                  onFinish={startGame}
                />
              </div>
            </div>
          ) : flow === "prevTopics" ? (
            <div className="relative min-h-[80vh] bg-center bg-cover bg-no-repeat rounded-xl border border-[--foreground]/20 overflow-hidden" style={{ backgroundImage: `url(${baseBg})` }}>
              <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>
              <div className="relative z-10 w-full min-h-[80vh] grid place-items-center">
                <PrevTopicsList
                  topics={savedTopics}
                  selectedIndex={selectedTopicIndex}
                  onSelect={(idx) => setSelectedTopicIndex((cur) => (cur === idx ? null : idx))}
                  onUse={(t) => { const padded = [0,1,2,3].map((i) => t.items[i] ? t.items[i] : { question: "", answer: "", hints: ["", "", ""] as [string,string,string] }); const itemsData = padded.map((it) => ({ question: it.question, hints: it.hints, answer: it.answer })); const secs = Math.max(10, Math.min(3600, Number((t as any).timerSeconds || 300))); setCurrentTopicTitle(t.title); startGameImmediate(itemsData, secs); }}
                  onDelete={async (t) => { try { await deleteTopic(t.title); setSavedTopics((prev) => prev.filter((x) => x.title !== t.title)); setSelectedTopicIndex(null); } catch {} }}
                />
                <div className="mt-6 text-right w-full max-w-2xl px-6">
                  <button onClick={() => setFlow("customEntry")} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
                </div>
              </div>
            </div>
          ) : flow === "game" ? (
            <div className="relative min-h-[80vh] rounded-xl border border-[--foreground]/20 overflow-hidden">
              <PhaseImage src={phaseBackground(stageIndex)} />
              <div className="absolute inset-0">
                <TimerOverlay remaining={remaining} running={running} formatTime={formatTime} onToggle={() => setRunning((r) => !r)} />

                {/* Hotspots overlay: use positions if available; otherwise show ground box */}
                {activeHotspots ? (
                  <HotspotsOverlay
                    hints={activeHotspots.hints}
                    lock={activeHotspots.lock}
                    onOpenHint={(i) => setOpenPanel((`hint${i+1}`) as any)}
                    onOpenQA={() => setOpenPanel("qa")}
                    canNext={answeredCorrect[stageIndex]}
                    onNext={goNextStage}
                  />
                ) : (
                  <ControlsBox onOpenPanel={(k) => setOpenPanel(k)} canNext={answeredCorrect[stageIndex]} onNext={goNextStage} />
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

