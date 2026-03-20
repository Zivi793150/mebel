import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

import { isAllowedCollection } from "@/lib/adminCollections";

function safeExt(filename: string) {
  const ext = path.extname(filename || "").toLowerCase();
  if (!ext) return "";
  if (!/^\.[a-z0-9]+$/i.test(ext)) return "";
  return ext.slice(0, 12);
}

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
    const baseDir = path.join(process.cwd(), "public", "uploads", collection);
    await mkdir(baseDir, { recursive: true });

    for (const file of files.slice(0, 20)) {
      const buf = Buffer.from(await file.arrayBuffer());
      const ext = safeExt(file.name) || ".bin";
      const name = crypto.randomBytes(16).toString("hex") + ext;
      const abs = path.join(baseDir, name);
      await writeFile(abs, buf);
      out.push(`/uploads/${collection}/${name}`);
    }

    return NextResponse.json({ ok: true, files: out });
  } catch {
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
