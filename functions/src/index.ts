const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const app = express();

app.get("/hello", (req: any, res: any) => {
  return res.status(200).send("Hello");
});

exports.app = functions.https.onRequest(app);
