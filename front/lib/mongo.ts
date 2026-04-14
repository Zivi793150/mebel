import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI is not set, MongoDB features will be disabled");
}

let clientPromise: Promise<MongoClient> | undefined;

export function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error("MONGODB_URI environment variable is not set"));
  }
  const promise = clientPromise ?? (clientPromise = new MongoClient(uri).connect());
  return promise;
}
