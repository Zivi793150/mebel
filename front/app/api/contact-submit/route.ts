import { NextResponse } from "next/server";

import { getMongoClient } from "@/lib/mongo";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const MANAGER_CHAT_IDS_RAW = process.env.MANAGER_CHAT_IDS || "";

const MANAGER_CHAT_IDS = MANAGER_CHAT_IDS_RAW.split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => Number(s))
  .filter((n) => Number.isFinite(n));

function normalizePhone(input: string) {
  const raw = String(input || "").trim();
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (!cleaned) return null;
  if (!/^[+]?\d{7,15}$/.test(cleaned)) return null;
  return cleaned;
}

function formatContactText(contact: {
  name: string;
  phone: string;
  comment: string;
  createdAt?: Date;
}) {
  const parts = [
    "Новая заявка на консультацию",
    `Имя: ${contact.name}`,
    `Телефон: ${contact.phone}`,
    contact.comment ? `Комментарий: ${contact.comment}` : "",
    contact.createdAt ? `Время: ${new Date(contact.createdAt).toLocaleString("ru-RU")}` : "",
  ].filter(Boolean);
  return parts.join("\n");
}

async function sendTelegramMessage(text: string) {
  if (!BOT_TOKEN) throw new Error("missing_bot_token");
  if (MANAGER_CHAT_IDS.length === 0) throw new Error("missing_manager_chat_ids");

  const results = await Promise.allSettled(
    MANAGER_CHAT_IDS.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`telegram_send_failed:${res.status}:${body}`);
      }
    })
  );

  const rejected = results.filter((r) => r.status === "rejected");
  if (rejected.length > 0) throw new Error("telegram_delivery_failed");
}

export async function POST(req: Request) {
  try {
    if (!BOT_TOKEN) {
      return NextResponse.json({ error: "missing_bot_token" }, { status: 500 });
    }
    if (MANAGER_CHAT_IDS.length === 0) {
      return NextResponse.json({ error: "missing_manager_chat_ids" }, { status: 500 });
    }

    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      comment?: string;
    };

    const name = String(body.name || "").trim();
    const phone = normalizePhone(String(body.phone || ""));
    const comment = String(body.comment || "").trim();

    if (name.length < 2 || !phone) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const contactDoc = {
      name,
      phone,
      comment,
      createdAt: new Date(),
      source: "website_contact",
    };

    let insertRes: { insertedId: unknown } | null = null;
    try {
      const client = await getMongoClient();
      const col = client.db("koenig").collection("contacts");
      insertRes = await col.insertOne(contactDoc);
    } catch {
      return NextResponse.json({ error: "mongo_error" }, { status: 500 });
    }

    const text = formatContactText({
      name: contactDoc.name,
      phone: contactDoc.phone,
      comment: contactDoc.comment,
      createdAt: contactDoc.createdAt,
    });

    try {
      await sendTelegramMessage(text);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "telegram_error";
      return NextResponse.json({ error: "telegram_error", detail: msg }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: String(insertRes.insertedId) });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
