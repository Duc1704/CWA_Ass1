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
  const stages = useMemo(() => [
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
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(() => stages.map(() => ""));

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

  const formatTime = (total: number) => {
    const mm = Math.floor(total / 60).toString().padStart(2, "0");
    const ss = Math.floor(total % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
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
    setSubmitted(true);
    setRunning(false);
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
            {!submitted ? (
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
            ) : (
              <div className="mx-4 w-full max-w-7xl xl:max-w-[88rem] grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-8">
                {/* Left: stage content */}
                <div className="bg-[--background]/70 border border-white/10 rounded-xl p-6 lg:p-8 text-white backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-base opacity-80">Stage {stageIndex + 1} of {stages.length}</div>
                    <div className="text-base opacity-80">{running ? "In progress" : "Paused"}</div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{stages[stageIndex].title}</h3>
                  <p className="text-base mb-5 opacity-90">{stages[stageIndex].description}</p>

                  <div className="text-base mb-2 opacity-80">{stages[stageIndex].promptLabel}</div>
                  <input
                    readOnly
                    value={stages[stageIndex].preset}
                    className="w-full mb-4 px-4 py-3 rounded-md bg-black/50 text-white text-base border border-white/30 outline-none"
                  />
                  <textarea
                    value={answers[stageIndex]}
                    onChange={(e) => {
                      const text = e.target.value;
                      setAnswers((prev) => prev.map((v, i) => (i === stageIndex ? text : v)));
                    }}
                    placeholder="Type the correctly formatted code here"
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
                        if (stageIndex < stages.length - 1) {
                          setStageIndex((i) => i + 1);
                        } else {
                          setRunning(false);
                        }
                      }}
                      type="button"
                    >
                      {stageIndex < stages.length - 1 ? "Submit" : "Finish"}
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


