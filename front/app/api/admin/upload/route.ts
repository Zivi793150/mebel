import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

import { isAllowedCollection } from "@/lib/adminCollections";

function safeExt(filename: string) {
  const ext = path.extname(filename || "").toLowerCase();
  if (!ext) return "";
  if (!/\.[a-z0-9]+$/i.test(ext)) return "";
  return ext.slice(0, 12);
}

// Маппинг коллекций на папки каталога
const COLLECTION_TO_FOLDER: Record<string, string> = {
  catalog_items: "1.shtory-i-tkani",
  blinds_types: "2.zhalyuzi",
  roman_catalogs: "3.rimskie",
  cornices: "4.karnizy",
  decor_items: "5.-dekor-furnitura",
  carpet_items: "6.-kovry",
  bedding_items: "7.postelnoe-bele",
  bedspreads_and_pillows: "8.dekorativnye-podushki-pokryvala",
};

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_form" }, { status: 400 });

  const collection = String(form.get("collection") || "").trim();
  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: "invalid_collection" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "no_files" }, { status: 400 });

  try {
    const out: string[] = [];
    
    // Определяем папку назначения
    const folderName = COLLECTION_TO_FOLDER[collection] || collection;
    const baseDir = path.join(process.cwd(), "public", "catalog", folderName);
    await mkdir(baseDir, { recursive: true });

    for (const file of files.slice(0, 20)) {
      const buf = Buffer.from(await file.arrayBuffer());
      const ext = safeExt(file.name) || ".bin";
      const name = crypto.randomBytes(16).toString("hex") + ext;
      const abs = path.join(baseDir, name);
      await writeFile(abs, buf);
      out.push(`/catalog/${folderName}/${name}`);
    }

    return NextResponse.json({ ok: true, files: out });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
