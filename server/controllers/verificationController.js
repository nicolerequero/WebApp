
const Verification = require("../models/verification");
var C = require("crypto-js");
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const db = admin.firestore();
const nodemailer = require('nodemailer');
require('dotenv').config("./.env");

const verificationCollection = db.collection('Verification');
const customerCollection = db.collection('Users');
const itinerantCollection = db.collection('Itinerants');
exports.getAllVerifications = async (req, res) => {
  const verificationsSnapshot = await verificationCollection.where('status', '==', 2).orderBy('id_expirationDate', 'desc').get();
  const verifications = [];

  // Loop through each verification and get the customer details
  for (const verificationDoc of verificationsSnapshot.docs) {
    const verificationData = verificationDoc.data();
  

    if (verificationData.custId) {
      const customerDoc = await customerCollection.doc(verificationData.custId).get();
      const customerData = customerDoc.data();
      const verification = new Verification(verificationData, verificationDoc.id);
      if (customerData.verified === false) {
        verification.customerDetails = customerData;
        verifications.push(verification);
      }
    } else if (verificationData.itinId) {
      const itineraryDoc = await itinerantCollection.doc(verificationData.itinId).get();
      const itineraryData = itineraryDoc.data();  
      const verification = new Verification(verificationData, verificationDoc.id);
      if (itineraryData.verified === false) {
        verification.customerDetails = itineraryData;
        verifications.push(verification);
      }
    }
   
  }

  res.send({ success: true, data: { verifications } });
};


exports.verifyCustomer = async (req, res) => {
  jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {

    // If JWT contains an admin ID
    var decodedData = JSON.parse(decoded.admin_id);

    var bytes = C.AES.decrypt(decodedData.password, process.env.SECRET_KEY);
    var originalText = bytes.toString(C.enc.Utf8);
   
    try {
      
      if(req.body.custId){
        const customerUser = await customerCollection.doc(req.body.custId).get();
        if (!customerUser.empty && originalText === req.body.password) {
          const user = customerUser;
          const userType = "Customer";
          const uid = user.id;
          const userRef = customerCollection.doc(uid);
          await userRef.update({ verified: true });
          const verificationId = req.body.uid;
          const docRef = verificationCollection.doc(verificationId);
          await docRef.update({status: 3})

          await sendVerificationEmail(req.body.email, userType);
          res.send({ success: true, message: `Successfully verify ${userType}.` });
        }else {
          res.send({ success: false, message: "Invalid email or password", data: null });
        }
      }else if(req.body.itinId){
          const itinerantUser = await itinerantCollection.doc(req.body.itinId).get();
          if (!itinerantUser.empty && originalText === req.body.password) {
            const user = itinerantUser;
            const userType = "Itinerant";
            const uid = user.id;
            const userRef = itinerantCollection.doc(uid);
            await userRef.update({ verified: true });
            const verificationId = req.body.uid;
            const docRef = verificationCollection.doc(verificationId);
            await docRef.update({status: 3})

            await sendVerificationEmail(req.body.email, userType);
            res.send({ success: true, message: `Successfully verify ${userType}.` });
          }else {
            res.send({ success: false, message: "Invalid email or password", data: null });
          }
           
      }
   
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: "An error occured.", data: null });
    }
  })
}

exports.denyCustomer = async (req, res) => {
  jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {

    // If JWT contains an admin ID
    var decodedData = JSON.parse(decoded.admin_id);

    var bytes = C.AES.decrypt(decodedData.password, process.env.SECRET_KEY);
    var originalText = bytes.toString(C.enc.Utf8);
   
    try {
      
      if(req.body.custId){
        const customerUser = await customerCollection.doc(req.body.custId).get();
        if (!customerUser.empty && originalText === req.body.password) {
          const user = customerUser;
          const userType = "Customer";
          const uid = user.id;
          const userRef = customerCollection.doc(uid);
        
          await userRef.set({ message: req.body.message }, {merge:true});
          const verificationId = req.body.uid;
          const docRef = verificationCollection.doc(verificationId);
          await docRef.update({status: 1})


          await sendDenyVerificationEmail(req.body.email, userType, req.body.message);
          res.send({ success: true, message: `Successfully verify ${userType}.` });
        }else {
          res.send({ success: false, message: "Invalid email or password", data: null });
        }
      }else if(req.body.itinId){
          const itinerantUser = await itinerantCollection.doc(req.body.itinId).get();
          if (!itinerantUser.empty && originalText === req.body.password) {
            const user = itinerantUser;
            const userType = "Itinerant";
            const uid = user.id;
            const userRef = itinerantCollection.doc(uid);
            await userRef.set({ message: req.body.message }, {merge:true});
            const verificationId = req.body.uid;
            const docRef = verificationCollection.doc(verificationId);
            await docRef.update({status: 1})

            await sendDenyVerificationEmail(req.body.email, userType, req.body.message);
            res.send({ success: true, message: `Successfully verify ${userType}.` });
          }else {
            res.send({ success: false, message: "Invalid email or password", data: null });
          }
           
      }
   
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: "An error occured.", data: null });
    }
  })
}

// Function to send verification email
async function sendVerificationEmail(email, userType) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USERNAME, // Fetch username from environment variable
      pass: process.env.GMAIL_PASSWORD // Fetch password from environment variable
    }
  });

  // Define the email options
  const mailOptions = {
    from: process.env.GMAIL_USERNAME, // Use sender email from environment variable
    to: email, // Use recipient's email
    subject: 'Verification Successful',
    text: `Dear ${userType}, your account has been successfully verified.`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Function to send deny verification email
async function sendDenyVerificationEmail(email, userType, message) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USERNAME, // Fetch username from environment variable
      pass: process.env.GMAIL_PASSWORD // Fetch password from environment variable
    }
  });

  // Define the email options
  const mailOptions = {
    from: process.env.GMAIL_USERNAME, // Use sender email from environment variable
    to: email, // Use recipient's email
    subject: 'Verification Rejected',
    text: `Dear ${userType}, your account has been unsuccessfully verified.
    Reason: ${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}