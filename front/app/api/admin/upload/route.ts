import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";

import { isAllowedCollection } from "@/lib/adminCollections";

function safeExt(filename: string) {
  const ext = path.extname(filename || "").toLowerCase();
  if (!ext) return "";
  if (!/\.[a-z0-9]+$/i.test(ext)) return "";
  return ext.slice(0, 12);
}

// Конвертируемое в WebP расширения
const CONVERTIBLE_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".jfif", ".jif", ".webp"
]);

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_form" }, { status: 400 });

  const collection = String(form.get("collection") || "").trim();
  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: "invalid_collection" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return NextResponse.json({ error: "no_files" }, { status: 400 });

  // Получаем подпапку (опционально)
  const subfolder = String(form.get("subfolder") || "").trim();
  // Разрешаем вложенные папки через /
  const safeSubfolder = /^[a-zA-Z0-9._\-/]+$/.test(subfolder) ? subfolder : "";

  try {
    const out: string[] = [];
    
    // Все загрузки идут в public/uploads/
    const baseDir = safeSubfolder 
      ? path.join(process.cwd(), "public", "uploads", safeSubfolder)
      : path.join(process.cwd(), "public", "uploads");
    await mkdir(baseDir, { recursive: true });

    for (const file of files.slice(0, 20)) {
      const buf = Buffer.from(await file.arrayBuffer());
      const originalExt = safeExt(file.name) || ".bin";
      const baseName = crypto.randomBytes(16).toString("hex");
      
      // Конвертируем в WebP если возможно
      const shouldConvert = CONVERTIBLE_EXTS.has(originalExt);
      const finalName = shouldConvert ? `${baseName}.webp` : `${baseName}${originalExt}`;
      const abs = path.join(baseDir, finalName);
      
      if (shouldConvert) {
        await sharp(buf)
          .webp({ quality: 85, effort: 4 })
          .toFile(abs);
      } else {
        await writeFile(abs, buf);
      }
      
      const urlPath = safeSubfolder 
        ? `/uploads/${safeSubfolder}/${finalName}`
        : `/uploads/${finalName}`;
      out.push(urlPath);
    }

    return NextResponse.json({ ok: true, files: out });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
