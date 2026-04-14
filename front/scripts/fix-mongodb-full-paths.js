const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/koenig";

// Mapping from short MongoDB paths to full real paths
const FOLDER_MAPPING = {
  // Шторы и ткани
  "1.2.Римские": "1.Шторы и ткани/1.2.Римские",
  "1.1.Австрийские": "1.Шторы и ткани/1.1.Австрийские",
  "1.3.Портьеры для окон": "1.Шторы и ткани/1.3.Портьеры для окон",
  "1.4. Рулонные шторы": "1.Шторы и ткани/1.4. Рулонные шторы",
  "1.5. Шторы для гостиниц": "1.Шторы и ткани/1.5. Шторы для гостиниц",
  "1.6.Шаттерсы": "1.Шторы и ткани/1.6.Шаттерсы",
  "1.7.Шторы в гостиную": "1.Шторы и ткани/1.7.Шторы в гостиную",
  "1.8. Шторы в детскую": "1.Шторы и ткани/1.8. Шторы в детскую",
  "1.9.Шторы в загород дом": "1.Шторы и ткани/1.9.Шторы в загород дом",
  "1.10. Шторы в кухню": "1.Шторы и ткани/1.10. Шторы в кухню",
  "1.11. Шторы  кабинет": "1.Шторы и ткани/1.11. Шторы  кабинет",
  "1.12.Шторы  в офис": "1.Шторы и ткани/1.12.Шторы  в офис",
  "1.13.Шторы в спальню": "1.Шторы и ткани/1.13.Шторы в спальню",
  "1.14 Шторы на люверсах": "1.Шторы и ткани/1.14 Шторы на люверсах",
  "1.15 Шторы в ванную": "1.Шторы и ткани/1.15 Шторы в ванную",
  
  // Жалюзи
  "Алюминиевые": "2.Жалюзи/Алюминиевые",
  "Деревянные": "2.Жалюзи/Деревянные",
  "Плиссе": "2.Жалюзи/Плиссе",
  "Римские": "2.Жалюзи/Римские",
  "Рулонные": "2.Жалюзи/Рулонные",
  "Текстильные": "2.Жалюзи/Текстильные",
};

function fixPath(mongoPath) {
  let fixed = mongoPath;
  
  for (const [short, full] of Object.entries(FOLDER_MAPPING)) {
    // Replace short path with full path
    if (fixed.includes(`/${short}/`)) {
      fixed = fixed.replace(`/${short}/`, `/${full}/`);
    }
  }
  
  return fixed;
}

function updateDocPaths(obj) {
  if (typeof obj === "string") {
    if (/\.(webp|jpe?g|png)$/i.test(obj) && obj.startsWith("/catalog/")) {
      return fixPath(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(updateDocPaths);
  }
  if (obj && typeof obj === "object") {
    const result = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] = updateDocPaths(v);
    }
    return result;
  }
  return obj;
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("koenig");
  
  const collections = ["curtain_types", "blinds_types", "bedspreads_and_pillows"];
  let totalFixed = 0;
  
  for (const collName of collections) {
    console.log(`\n--- Processing ${collName} ---`);
    const col = db.collection(collName);
    const docs = await col.find({}).toArray();
    
    for (const doc of docs) {
      const updated = updateDocPaths(doc);
      
      // Check if changed
      if (JSON.stringify(doc) !== JSON.stringify(updated)) {
        delete updated._id;
        await col.updateOne({ _id: doc._id }, { $set: updated });
        totalFixed++;
        console.log(`Fixed doc ${doc._id}`);
      }
    }
  }
  
  console.log(`\n=== Fixed ${totalFixed} documents ===`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
