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

function formatLeadText(lead: {
  name: string;
  phone: string;
  message: string;
  context?: {
    title?: string;
    category?: string;
    productType?: string;
    url?: string;
  };
  createdAt?: Date;
}) {
  const ctx = lead.context || {};
  const parts = [
    "Новая заявка (с сайта)",
    ctx.title ? `Товар: ${ctx.title}` : "",
    ctx.category ? `Категория: ${ctx.category}` : "",
    ctx.productType ? `Тип: ${ctx.productType}` : "",
    ctx.url ? `Ссылка: ${ctx.url}` : "",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Сообщение: ${lead.message}`,
    lead.createdAt ? `Время: ${new Date(lead.createdAt).toLocaleString("ru-RU")}` : "",
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

async function sendTelegramPhoto(image: string, caption: string) {
  if (!BOT_TOKEN) throw new Error("missing_bot_token");
  if (MANAGER_CHAT_IDS.length === 0) throw new Error("missing_manager_chat_ids");

  const results = await Promise.allSettled(
    MANAGER_CHAT_IDS.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          photo: image,
          caption,
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
      message?: string;
      context?: {
        productType?: string;
        source?: string;
        kind?: string;
        url?: string;
        title?: string;
        category?: string;
        image?: string;
        images?: string[];
      };
    };

    const name = String(body.name || "").trim();
    const phone = normalizePhone(String(body.phone || ""));
    const message = String(body.message || "").trim();

    if (name.length < 2 || !phone || message.length < 3) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const context = body.context || null;

    const leadDoc = {
      name,
      phone,
      message,
      context,
      createdAt: new Date(),
      source: "website",
    };

    let insertRes: { insertedId: unknown } | null = null;
    try {
      const client = await getMongoClient();
      const col = client.db("koenig").collection("leads");
      insertRes = await col.insertOne(leadDoc);
    } catch {
      return NextResponse.json({ error: "mongo_error" }, { status: 500 });
    }

    const text = formatLeadText({
      name: leadDoc.name,
      phone: leadDoc.phone,
      message: leadDoc.message,
      context: context ?? undefined,
      createdAt: leadDoc.createdAt,
    });

    try {
      const image = context?.image;
      if (image && /^https?:\/\//i.test(String(image))) {
        await sendTelegramPhoto(String(image), text);
      } else {
        await sendTelegramMessage(text);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "telegram_error";
      return NextResponse.json({ error: "telegram_error", detail: msg }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: String(insertRes.insertedId) });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
