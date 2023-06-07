require('dotenv').config("./.env");
const Admin = require("../models/admin");
var C = require("crypto-js");
const { generateAdminAccessToken } = require('../helpers/generateAdminAccessToken');

const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const auth = admin.auth();

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await auth.getUserByEmail(email);
    console.log(userRecord);
    const userId = userRecord.uid;

    const querySnapshot = await db.collection('Admins')
      .doc(userId)
      .get();

    if (!querySnapshot.exists) {
      res.send({ success: false, message: "Account not found." });
      return;
    }

    const data = querySnapshot.data();
    const decryptedPassword = C.AES.decrypt(data.password, process.env.SECRET_KEY).toString(C.enc.Utf8);

    if (decryptedPassword !== password || data.password === "") {
      res.send({ success: false, message: "The credentials provided do not match." });
      return;
    }
    const admin = new Admin(data, querySnapshot.id);
    const accessToken = generateAdminAccessToken(admin);
    res.send({ success: true, message: "Login Successful!", data: accessToken });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "The credentials provided do not match." });
  }
};
