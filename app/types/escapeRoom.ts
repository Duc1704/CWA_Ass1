export type WizardItem = { question: string; hints: [string, string, string]; answer: string };
export type Flow = "mode" | "customEntry" | "topicName" | "wizard" | "prevTopics" | "game" | "bad" | "good";
export type Panel = "qa" | "hint1" | "hint2" | "hint3" | null;
export type Topic = { title: string; timerSeconds: number; items: WizardItem[] };


