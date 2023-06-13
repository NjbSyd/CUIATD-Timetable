const {MongoDB_Database,} = require('./MongoConfig.js');
const {MongoDB_Connector} = require("./MongoConfig");

const ConnectToMongoDB = async () => {
   try {
      await MongoDB_Connector.connect();
      console.log("Connected to the database")
   } catch (err) {
      console.error(`Something went wrong trying to connect to the database: ${err}\n`);
   }
}

const DisconnectFromMongo = async () => {
   try {
      await MongoDB_Connector.close();
      console.log("Disconnected from the database")
   } catch (err) {
      console.error(`Something went wrong trying to disconnect from the database: ${err}\n`);
   }
}

const AddManyDocuments = async (collectionName, docs) => {
   try {
      const collection = MongoDB_Database.collection(collectionName);
      const existingDocsInMongoDB = (await collection.find({_id: {$in: docs.map(doc => doc._id)}}).toArray()).map(doc => doc._id);
      let newDocs = docs.filter(doc => !existingDocsInMongoDB.includes(doc._id));
      const updatedDocsLocally = docs.filter(doc => existingDocsInMongoDB.includes(doc._id));
      if (newDocs.length > 0) {
         const result = await collection.insertMany(newDocs);
         console.log(`Inserted ${result.insertedCount} new documents in the collection ${collectionName}`);
      }
   } catch (err) {
      console.error(`Something went wrong trying to insert documents: ${err}\n`);
   }
}


module.exports = {ConnectToMongoDB, DisconnectFromMongo, AddManyDocuments};