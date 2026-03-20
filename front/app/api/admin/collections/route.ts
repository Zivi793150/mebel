import { NextResponse } from "next/server";

import { getMongoClient } from "@/lib/mongo";
import { ADMIN_COLLECTIONS } from "@/lib/adminCollections";

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db("koenig");

    const results = await Promise.all(
      ADMIN_COLLECTIONS.map(async (name) => {
        const count = await db.collection(name).countDocuments().catch(() => null);
        return { name, count };
      }),
    );

    return NextResponse.json({ collections: results });
  } catch {
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}
