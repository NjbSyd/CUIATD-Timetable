require('dotenv').config();
const {MongoClient} = require('mongodb');
const {MONGO_URI, MONGO_DATABASE} = process.env;

const MongoDB_Connector = new MongoClient(MONGO_URI.replace("<credentials-placeholder>",
    `${encodeURIComponent(process.env.MONGO_USERNAME)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}`));

const MongoDB_Database = MongoDB_Connector.db(MONGO_DATABASE);

module.exports = {MongoDB_Database, MongoDB_Connector};


