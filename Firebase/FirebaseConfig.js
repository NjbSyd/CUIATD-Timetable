const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

const serviceAccount = require("./serviceAccountKey.json");
const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://timetable-84856-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getFirestore(app);

module.exports = db;