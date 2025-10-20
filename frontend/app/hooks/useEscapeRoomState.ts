import { useState } from "react";

export type Panel = "qa" | "hint1" | "hint2" | "hint3" | null;
export type WizardItem = { question: string; hints: [string, string, string]; answer: string };

export default function useEscapeRoomState() {
  const [stageIndex, setStageIndex] = useState(0);
  const [openPanel, setOpenPanel] = useState<Panel>(null);
  const [answerInputs, setAnswerInputs] = useState<string[]>(["", "", "", ""]);
  const [answerErrors, setAnswerErrors] = useState<string[]>(["", "", "", ""]);
  const [answeredCorrect, setAnsweredCorrect] = useState<boolean[]>([false, false, false, false]);

  const submitAnswer = (index: number, expected: string) => {
    const curr = answerInputs[index] || "";
    const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
    if (normalize(curr) === normalize(expected)) {
      setAnsweredCorrect((prev) => prev.map((v, i) => (i === index ? true : v)));
      setAnswerErrors((prev) => prev.map((v, i) => (i === index ? "" : v)));
    } else {
      setAnswerErrors((prev) => prev.map((v, i) => (i === index ? "The answer is not correct." : v)));
    }
  };

  return {
    stageIndex, setStageIndex,
    openPanel, setOpenPanel,
    answerInputs, setAnswerInputs,
    answerErrors, setAnswerErrors,
    answeredCorrect, setAnsweredCorrect,
    submitAnswer,
  } as const;
}


