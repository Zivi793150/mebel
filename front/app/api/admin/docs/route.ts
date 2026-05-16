import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getMongoClient } from "@/lib/mongo";
import { isAllowedCollection } from "@/lib/adminCollections";

function buildQuery(qRaw: string) {
  const q = String(qRaw || "").trim();
  if (!q) return {};

  const or: Record<string, unknown>[] = [
    { title: { $regex: q, $options: "i" } },
    { slug: { $regex: q, $options: "i" } },
    { url: { $regex: q, $options: "i" } },
    { kind: { $regex: q, $options: "i" } },
    { type: { $regex: q, $options: "i" } },
    { subtype: { $regex: q, $options: "i" } },
    { collectionSlug: { $regex: q, $options: "i" } },
    { collectionTitle: { $regex: q, $options: "i" } },
    { variant: { $regex: q, $options: "i" } },
    { manufacturer: { $regex: q, $options: "i" } },
    { style: { $regex: q, $options: "i" } },
    { collection: { $regex: q, $options: "i" } },
    { color: { $regex: q, $options: "i" } },
  ];

  if (ObjectId.isValid(q)) {
    or.unshift({ _id: new ObjectId(q) });
  }

  return { $or: or };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collection = String(url.searchParams.get("collection") || "").trim();
  const q = String(url.searchParams.get("q") || "");
  const limit = Math.max(1, Math.min(200, Number(url.searchParams.get("limit") || 50)));
  const skip = Math.max(0, Number(url.searchParams.get("skip") || 0));

  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: "invalid_collection" }, { status: 400 });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    const col = db.collection(collection);

    const query = buildQuery(q);

    const [docs, total] = await Promise.all([
      col
        .find(query, { 
          projection: { 
            _id: 1, 
            title: 1, 
            slug: 1, 
            url: 1, 
            kind: 1, 
            type: 1, 
            variant: 1, 
            collectionTitle: 1, 
            subtypeTitle: 1, 
            group: 1,
            order: 1
          } 
        })
        .sort({ order: 1, _id: -1 })
        .skip(skip)
        .limit(1000)
        .toArray(),
      col.countDocuments(query),
    ]);

    return NextResponse.json({ docs, total, skip, limit });
  } catch {
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}
