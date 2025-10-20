const API = "/api/custom-questions";

export type CreateItem = { question: string; hint1?: string; hint2?: string; hint3?: string; answer: string };

export async function getTopics(): Promise<any[]> {
  const res = await fetch(API, { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}

export async function createTopic(params: { title: string; timerSeconds: number; items: CreateItem[] }): Promise<any> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTopic(title: string): Promise<void> {
  const res = await fetch(`${API}?title=${encodeURIComponent(title)}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete topic");
}


