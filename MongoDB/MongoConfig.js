require("dotenv").config();
const mongoose = require("mongoose");

const connectToMongoDatabase = async () => {
  const MongoURI = process.env.MONGO_URI.replace(
    "<credentials-placeholder>",
    `${encodeURI(process.env.MONGO_USERNAME)}:${encodeURI(
      process.env.MONGO_PASSWORD
    )}`
  ).replace("<Database-name>", `${encodeURI(process.env.MONGO_DATA_DATABASE)}`);
  try {
    await mongoose.connect(MongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    throw error;
  }
};

const disconnectFromMongoDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB Data Database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  connectToMongoDatabase,
  disconnectFromMongoDatabase,
};
