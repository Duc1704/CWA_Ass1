import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title: string = (body?.title ?? "").toString();
    const items: Array<{ question: string; hint1?: string; hint2?: string; hint3?: string; answer: string }> = Array.isArray(body?.items) ? body.items : [];
    const timerSeconds: number = Math.max(10, Math.min(3600, Number(body?.timerSeconds ?? 300)));

    if (!title.trim()) {
      return new Response(JSON.stringify({ error: "title is required" }), { status: 400 });
    }
    if (items.length === 0) {
      return new Response(JSON.stringify({ error: "items must be a non-empty array" }), { status: 400 });
    }
    if (items.some((i) => !i.question || !i.answer)) {
      return new Response(JSON.stringify({ error: "each item requires question and answer" }), { status: 400 });
    }

    // Use Prisma client models directly; remove raw SQL path to avoid readonly DB errors
    const anyPrisma = prisma as any;
    // Defensive: ensure model clients exist. If not, instantiate a fresh client.
    const client: any = (!anyPrisma.topic || !anyPrisma.question) ? new PrismaClient() : anyPrisma;
    let topic;
    try {
      topic = await client.topic.create({ data: { title, timerSeconds } });
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes("Unknown argument `timerSeconds`")) {
        // Prisma client not regenerated yet; create without timer to avoid failing
        console.warn("Prisma client missing timerSeconds field; creating topic without timer. Regenerate client to enable.");
        topic = await client.topic.create({ data: { title } });
        try {
          await (prisma as any).$executeRawUnsafe('UPDATE "Topic" SET "timerSeconds" = ? WHERE "id" = ?', timerSeconds, topic.id);
        } catch (rawErr) {
          console.error('Failed to set timerSeconds via raw SQL', rawErr);
        }
      } else {
        throw e;
      }
    }
    if (items.length > 0) {
      await client.question.createMany({
        data: items.map((it, idx) => ({
          prompt: it.question.toString(),
          hint1: it.hint1 ? String(it.hint1) : null,
          hint2: it.hint2 ? String(it.hint2) : null,
          hint3: it.hint3 ? String(it.hint3) : null,
          answer: it.answer.toString(),
          orderIndex: idx,
          topicId: topic.id,
        })),
      });
    }
    let created = await client.topic.findUnique({ where: { id: topic.id }, include: { questions: { orderBy: { orderIndex: "asc" } } } });
    if (!(created as any)?.timerSeconds) {
      const rows = await (prisma as any).$queryRawUnsafe(
        'SELECT id, createdAt, title, timerSeconds FROM "Topic" WHERE id = ? LIMIT 1',
        topic.id
      );
      if (rows && rows[0]) {
        created = { ...(created as any), timerSeconds: rows[0].timerSeconds } as any;
      }
    }
    if (client instanceof PrismaClient) await client.$disconnect();
    return new Response(JSON.stringify({ id: (created as any)!.id, createdAt: (created as any)!.createdAt, title: (created as any)!.title, timerSeconds: (created as any)!.timerSeconds, questions: (created as any)!.questions }), { status: 201 });
  } catch (err) {
    console.error("POST /api/custom-questions error", err);
    const message = (err as any)?.message || "internal_error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const anyPrisma = prisma as any;
    const client: any = (!anyPrisma.topic || !anyPrisma.question) ? new PrismaClient() : anyPrisma;
    const topics = await client.topic.findMany({ include: { questions: { orderBy: { orderIndex: "asc" } } }, orderBy: { createdAt: "desc" } });
    // Ensure timerSeconds is present even if the generated client is outdated
    const withTimers = Array.isArray(topics) ? [...topics] : [];
    if (withTimers.some((t: any) => typeof t?.timerSeconds === "undefined")) {
      try {
        const rows = await (prisma as any).$queryRawUnsafe('SELECT id, timerSeconds FROM "Topic"');
        const idToTimer = new Map<string, number>();
        (rows || []).forEach((r: any) => idToTimer.set(String(r.id), Number(r.timerSeconds)));
        withTimers.forEach((t: any) => {
          if (typeof t.timerSeconds === "undefined") t.timerSeconds = idToTimer.get(String(t.id));
        });
      } catch {
        // ignore raw errors; UI will fall back to defaults
      }
    }
    if (client instanceof PrismaClient) await client.$disconnect();
    return new Response(JSON.stringify(withTimers), { status: 200 });
  } catch (err) {
    console.error("GET /api/custom-questions error", err);
    const message = (err as any)?.message || "internal_error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = (searchParams.get("title") || "").toString();
    if (!title.trim()) {
      return new Response(JSON.stringify({ error: "title is required" }), { status: 400 });
    }
    // Delete topic and cascade its questions
    const anyPrisma = prisma as any;
    const client: any = (!anyPrisma.topic || !anyPrisma.question) ? new PrismaClient() : anyPrisma;
    const deleted = await client.topic.deleteMany({ where: { title } });
    if (client instanceof PrismaClient) await client.$disconnect();
    return new Response(JSON.stringify({ deleted: deleted.count }), { status: 200 });
  } catch (err) {
    console.error("DELETE /api/custom-questions error", err);
    const message = (err as any)?.message || "internal_error";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}


