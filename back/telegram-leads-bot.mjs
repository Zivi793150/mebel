import "dotenv/config";

import { MongoClient } from "mongodb";
import { Telegraf, session } from "telegraf";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "koenig";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "leads";
const MONGODB_CONTEXTS_COLLECTION = process.env.MONGODB_CONTEXTS_COLLECTION || "lead_contexts";

const managerChatIdsRaw = process.env.MANAGER_CHAT_IDS || "";
const MANAGER_CHAT_IDS = managerChatIdsRaw
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => Number(s))
  .filter((n) => Number.isFinite(n));

if (MANAGER_CHAT_IDS.length === 0) {
  throw new Error("MANAGER_CHAT_IDS is required (comma-separated chat ids)");
}

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db(MONGODB_DB);
const leads = db.collection(MONGODB_COLLECTION);
const leadContexts = db.collection(MONGODB_CONTEXTS_COLLECTION);

const bot = new Telegraf(BOT_TOKEN);
bot.use(
  session({
    defaultSession: () => ({}),
  })
);

function ensureSession(ctx) {
  if (!ctx.session) ctx.session = {};
  return ctx.session;
}

function resetLead(ctx) {
  ensureSession(ctx);
  ctx.session.lead = {
    step: "name",
    name: "",
    phone: "",
    message: "",
  };
}

function resetLeadContext(ctx) {
  ensureSession(ctx);
  ctx.session.leadContext = null;
}

function getLead(ctx) {
  ensureSession(ctx);
  if (!ctx.session.lead) resetLead(ctx);
  return ctx.session.lead;
}

function getLeadContext(ctx) {
  return (ctx.session && ctx.session.leadContext) || null;
}

async function tryLoadLeadContextById(id) {
  const key = String(id || "").trim();
  if (!key || key.length < 6 || key.length > 80) return null;
  const doc = await leadContexts.findOne({ id: key }, { projection: { _id: 0 } });
  return doc || null;
}

function normalizePhone(input) {
  const raw = String(input || "").trim();
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (!cleaned) return null;
  if (!/^[+]?\d{7,15}$/.test(cleaned)) return null;
  return cleaned;
}

function formatLeadForManager(leadDoc) {
  const ctx = leadDoc.leadContext || null;
  const parts = [
    "Новая заявка",
    ctx?.title ? `Товар: ${ctx.title}` : "",
    ctx?.category ? `Категория: ${ctx.category}` : "",
    ctx?.productType ? `Тип: ${ctx.productType}` : "",
    ctx?.url ? `Ссылка: ${ctx.url}` : "",
    `Имя: ${leadDoc.name}`,
    `Телефон: ${leadDoc.phone}`,
    `Сообщение: ${leadDoc.message}`,
    leadDoc.from?.username ? `Username: @${leadDoc.from.username}` : "",
    leadDoc.from?.id ? `User ID: ${leadDoc.from.id}` : "",
    leadDoc.createdAt ? `Время: ${new Date(leadDoc.createdAt).toLocaleString("ru-RU")}` : "",
    leadDoc._id ? `ID: ${String(leadDoc._id)}` : "",
  ].filter(Boolean);

  return parts.join("\n");
}

async function notifyManagers(leadDoc) {
  const caption = formatLeadForManager(leadDoc);
  const img = leadDoc?.leadContext?.image;
  if (img && /^https?:\/\//i.test(String(img))) {
    const results = await Promise.allSettled(
      MANAGER_CHAT_IDS.map((chatId) => bot.telegram.sendPhoto(chatId, img, { caption }))
    );
    const rejected = results.filter((r) => r.status === "rejected");
    if (rejected.length === 0) return;
  }

  await sendToManagers(caption);
}

async function sendToManagers(text) {
  const results = await Promise.allSettled(
    MANAGER_CHAT_IDS.map((chatId) => bot.telegram.sendMessage(chatId, text))
  );
  const rejected = results.filter((r) => r.status === "rejected");
  if (rejected.length > 0) {
    throw new Error("Failed to deliver to one or more managers");
  }
}

async function startLeadFlow(ctx) {
  resetLead(ctx);
  await ctx.reply("Оставьте заявку.\n\nВведите ваше имя:");
}

bot.start(async (ctx) => {
  const startPayload = ctx.startPayload ? String(ctx.startPayload).trim() : "";
  if (startPayload.startsWith("lc_")) {
    const id = startPayload.slice(3);
    const lc = await tryLoadLeadContextById(id);
    if (lc) {
      ctx.session.leadContext = lc;
      await ctx.reply(
        `Отклик по товару:\n${lc.title ? `• ${lc.title}\n` : ""}${lc.category ? `• ${lc.category}\n` : ""}\nТеперь оставьте заявку.`
      );
      await startLeadFlow(ctx);
      return;
    }
  }

  resetLeadContext(ctx);
  await ctx.reply("Здравствуйте! Нажмите /lead чтобы оставить заявку.");
});

bot.command("lead", startLeadFlow);

bot.command("cancel", async (ctx) => {
  ctx.session.lead = null;
  resetLeadContext(ctx);
  await ctx.reply("Ок, отменил. Если захотите снова — /lead");
});

bot.on("text", async (ctx) => {
  const text = String(ctx.message.text || "").trim();

  if (text === "/lead") return;
  if (text === "/cancel") return;

  const lead = getLead(ctx);

  if (lead.step === "name") {
    if (text.length < 2) {
      await ctx.reply("Имя слишком короткое. Введите имя ещё раз:");
      return;
    }
    lead.name = text;
    lead.step = "phone";
    await ctx.reply("Введите телефон (пример: +79991234567):");
    return;
  }

  if (lead.step === "phone") {
    const phone = normalizePhone(text);
    if (!phone) {
      await ctx.reply("Телефон выглядит некорректно. Введите ещё раз (пример: +79991234567):");
      return;
    }
    lead.phone = phone;
    lead.step = "message";
    await ctx.reply("Введите сообщение (что нужно посчитать/подобрать):");
    return;
  }

  if (lead.step === "message") {
    if (text.length < 3) {
      await ctx.reply("Сообщение слишком короткое. Напишите подробнее:");
      return;
    }

    lead.message = text;

    const leadDoc = {
      name: lead.name,
      phone: lead.phone,
      message: lead.message,
      createdAt: new Date(),
      leadContext: getLeadContext(ctx),
      from: {
        id: ctx.from?.id ?? null,
        username: ctx.from?.username ?? null,
        firstName: ctx.from?.first_name ?? null,
        lastName: ctx.from?.last_name ?? null,
      },
      source: "telegram_bot",
    };

    const insertRes = await leads.insertOne(leadDoc);

    await notifyManagers({ ...leadDoc, _id: insertRes.insertedId });

    ctx.session.lead = null;
    resetLeadContext(ctx);
    await ctx.reply("Спасибо! Заявка отправлена менеджеру.");
    return;
  }

  await startLeadFlow(ctx);
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

bot.launch();
