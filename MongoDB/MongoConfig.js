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

module.exports = {
  connectToMongoDatabase,
};
