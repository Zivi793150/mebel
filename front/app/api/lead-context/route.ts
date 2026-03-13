import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getMongoClient } from "@/lib/mongo";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      productType?: string;
      source?: string;
      kind?: string;
      url?: string;
      title?: string;
      category?: string;
      image?: string;
      images?: string[];
    };

    const url = String(body.url || "").trim();
    const productType = String(body.productType || "").trim();

    if (!url || !productType) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const client = await getMongoClient();
    const col = client.db("koenig").collection("lead_contexts");

    const id = randomUUID().replace(/-/g, "");

    await col.insertOne({
      id,
      productType,
      source: body.source || null,
      kind: body.kind || null,
      url,
      title: body.title || null,
      category: body.category || null,
      image: body.image || null,
      images: Array.isArray(body.images) ? body.images.slice(0, 10) : [],
      createdAt: new Date(),
    });

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
