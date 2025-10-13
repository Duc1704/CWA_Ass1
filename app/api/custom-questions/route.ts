import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const author: string = (body?.author ?? "").toString();
    const items: Array<{ title?: string; question: string; answer: string }> = Array.isArray(body?.items) ? body.items : [];

    if (!author.trim()) {
      return new Response(JSON.stringify({ error: "author is required" }), { status: 400 });
    }
    if (items.length === 0) {
      return new Response(JSON.stringify({ error: "items must be a non-empty array" }), { status: 400 });
    }
    if (items.some((i) => !i.question || !i.answer)) {
      return new Response(JSON.stringify({ error: "each item requires question and answer" }), { status: 400 });
    }

    const created = await prisma.customSet.create({
      data: {
        author,
        topics: {
          create: items.map((it, idx) => ({
            title: (it.title ?? `Stage ${idx + 1}`).toString(),
            question: it.question.toString(),
            answer: it.answer.toString(),
            orderIndex: idx,
          })),
        },
      },
      include: { topics: true },
    });

    return new Response(JSON.stringify({ id: created.id, createdAt: created.createdAt, topics: created.topics }), { status: 201 });
  } catch (err) {
    console.error("POST /api/custom-questions error", err);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const sets = await prisma.customSet.findMany({ include: { topics: { orderBy: { orderIndex: "asc" } } }, orderBy: { createdAt: "desc" } });
    return new Response(JSON.stringify(sets), { status: 200 });
  } catch (err) {
    console.error("GET /api/custom-questions error", err);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = (searchParams.get("title") || "").toString();
    if (!title.trim()) {
      return new Response(JSON.stringify({ error: "title is required" }), { status: 400 });
    }
    // Delete all topic rows that match this title; sets will cascade delete if empty
    const deleted = await prisma.customTopic.deleteMany({ where: { title } });
    return new Response(JSON.stringify({ deleted: deleted.count }), { status: 200 });
  } catch (err) {
    console.error("DELETE /api/custom-questions error", err);
    return new Response(JSON.stringify({ error: "internal_error" }), { status: 500 });
  }
}


