const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, "credentials/.env"),
});
const { MongoClient, ServerApiVersion } = require("mongodb");
const databaseName = "finalproject";
const collectionName = "scores";
const uri = process.env.MONGO_CONNECTION_STRING;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

async function connectClient() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
}


async function insert(n, s) {
   try {
      await connectClient();
      const database = client.db(databaseName);
      const collection = database.collection(collectionName);
      const player = { name: n, score: s };
      await collection.insertOne(player);
   } catch (e) {
      console.error(e);
   }
}

async function findScores() {
    let result = [];
    try {
       await connectClient();
       const database = client.db(databaseName);
       const collection = database.collection(collectionName);
       const cursor = collection.find({});
       result = await cursor.toArray();
    } catch (e) {
       console.error(e);
    }
    return result;
}

async function remove() {
  try {
    await connectClient();
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    const lowest = await collection
      .find({})
      .sort({ score: 1 })   
      .limit(1)
      .toArray();

    if (lowest.length > 0) {
      const docToDelete = lowest[0];
      await collection.deleteOne({ _id: docToDelete._id });
    }

  } catch (e) {
    console.error(e);
  }
}

module.exports = { insert, findScores, remove };
