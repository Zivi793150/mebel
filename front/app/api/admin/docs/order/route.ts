import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoClient } from "@/lib/mongo";
import { isAllowedCollection } from "@/lib/adminCollections";

export async function PUT(req: Request) {
  try {
    const { collection, orders } = await req.json();

    if (!isAllowedCollection(collection)) {
      return NextResponse.json({ error: "invalid_collection" }, { status: 400 });
    }

    if (!Array.isArray(orders)) {
      return NextResponse.json({ error: "invalid_orders" }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db("koenig");
    const col = db.collection(collection);

    const bulkOps = orders.map((item: { id: string; order: number }) => ({
      updateOne: {
        filter: { _id: new ObjectId(item.id) },
        update: { $set: { order: item.order } },
      },
    }));

    if (bulkOps.length > 0) {
      await col.bulkWrite(bulkOps);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bulk order update error:", error);
    return NextResponse.json({ error: "mongo_error" }, { status: 500 });
  }
}
