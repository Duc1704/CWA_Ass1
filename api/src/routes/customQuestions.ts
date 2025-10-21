import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient({
  datasources: { db: { url: String(process.env.DATABASE_URL || "file:./prisma/dev.db") } }
});

router.get("/", async (_req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      include: { questions: { orderBy: { orderIndex: "asc" } } },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json(topics);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "internal_error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const title = String(body.title || "");
    const items = Array.isArray(body.items) ? body.items : [];
    const timerSeconds = Math.max(10, Math.min(3600, Number(body.timerSeconds ?? 300)));

    if (!title.trim()) return res.status(400).json({ error: "title is required" });
    if (items.length === 0) return res.status(400).json({ error: "items must be a non-empty array" });
    if (items.some((i: any) => !i?.question || !i?.answer)) {
      return res.status(400).json({ error: "each item requires question and answer" });
    }

    const topic = await prisma.topic.create({ data: { title, timerSeconds } });

    if (items.length > 0) {
      await prisma.question.createMany({
        data: items.map((it: any, idx: number) => ({
          prompt: String(it.question),
          hint1: it.hint1 ? String(it.hint1) : null,
          hint2: it.hint2 ? String(it.hint2) : null,
          hint3: it.hint3 ? String(it.hint3) : null,
          answer: String(it.answer),
          orderIndex: idx,
          topicId: topic.id
        }))
      });
    }

    const created = await prisma.topic.findUnique({
      where: { id: topic.id },
      include: { questions: { orderBy: { orderIndex: "asc" } } }
    });

    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "internal_error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const title = String((req.query.title as string) || "");
    if (!title.trim()) return res.status(400).json({ error: "title is required" });
    const deleted = await prisma.topic.deleteMany({ where: { title } });
    res.status(200).json({ deleted: deleted.count });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "internal_error" });
  }
});

export default router;


