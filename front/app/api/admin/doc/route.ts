import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getMongoClient } from "@/lib/mongo";
import { isAllowedCollection } from "@/lib/adminCollections";

function parseId(idRaw: string) {
  const id = String(idRaw || "").trim();
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const collection = String(url.searchParams.get("collection") || "").trim();
  const id = parseId(String(url.searchParams.get("id") || ""));

  if (!isAllowedCollection(collection) || !id) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    const doc = await db.collection(collection).findOne({ _id: id });
    return NextResponse.json({ doc });
  } catch {
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { collection?: string; doc?: Record<string, unknown> } | null;
  const collection = String(body?.collection || "").trim();
  const doc = body?.doc && typeof body.doc === "object" ? body.doc : null;

  if (!isAllowedCollection(collection) || !doc) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    const res = await db.collection(collection).insertOne(doc);
    return NextResponse.json({ ok: true, id: String(res.insertedId) });
  } catch {
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as { collection?: string; id?: string; doc?: Record<string, unknown> } | null;
  const collection = String(body?.collection || "").trim();
  const id = parseId(String(body?.id || ""));
  const doc = body?.doc && typeof body.doc === "object" ? body.doc : null;

  if (!isAllowedCollection(collection) || !id || !doc) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { _id, ...rest } = doc as { _id?: unknown } & Record<string, unknown>;

  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    await db.collection(collection).updateOne({ _id: id }, { $set: rest });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const collection = String(url.searchParams.get("collection") || "").trim();
  const id = parseId(String(url.searchParams.get("id") || ""));

  if (!isAllowedCollection(collection) || !id) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("koenig");
    await db.collection(collection).deleteOne({ _id: id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}
