import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient(): Promise<MongoClient> {
  const promise = clientPromise ?? (clientPromise = new MongoClient(uri).connect());
  return promise;
}
