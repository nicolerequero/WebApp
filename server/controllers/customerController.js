
const Customer = require("../models/customer");
var C = require("crypto-js");
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const db = admin.firestore();

const customerCollection = db.collection('Users');
exports.getAllCustomers = async (req, res) => {
    // Get all active customers 
    const customersSnapshot = await customerCollection
        .where('status', '==', true)
        .orderBy('createdAt', 'desc')
        .get();
    const customers = [];
    customersSnapshot.forEach((doc) => {
        const customer = new Customer(doc.data(), doc.id);
        customers.push(customer);
    });


    // Get all inactive customers
    const inactiveCustomersSnapshot = await customerCollection
        .where('status', '==', false)
        .orderBy('createdAt', 'desc')
        .get();
    const inactiveCustomers = [];
    inactiveCustomersSnapshot.forEach((doc) => {
        const customer = new Customer(doc.data(), doc.id);
        inactiveCustomers.push(customer);
    });

    // Return the results
    res.send({ success: true, data: { customers, inactiveCustomers } });
};


exports.deactivateCustomer = async (req, res) => {
    jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {

        // If JWT contains an admin ID
        var decodedData = JSON.parse(decoded.admin_id);
       
        var bytes = C.AES.decrypt(decodedData.password, process.env.SECRET_KEY);
        var originalText = bytes.toString(C.enc.Utf8);

        try {
            const customerUser = await customerCollection.where('email', '==', req.body.email).get();
          
            if (!customerUser.empty && originalText === req.body.password) {
                const user = customerUser.docs[0];
                const userType = "Customer";
                const uid = user.id;
                const userRef = customerCollection.doc(uid);
                await userRef.update({ status: false });
                res.send({ success: true, message: `Successfully deactivated ${userType}.` });
            }else {
                res.send({ success: false, message: "Invalid email or password", data: null });
            }
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: "Error... Please try again later.", data: null });
        }
    })
}


exports.reactivateCustomer = async (req, res) => {
    jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {

        // If JWT contains an admin ID
        var decodedData = JSON.parse(decoded.admin_id);
       
        var bytes = C.AES.decrypt(decodedData.password, process.env.SECRET_KEY);
        var originalText = bytes.toString(C.enc.Utf8);

        try {
            const customerUser = await customerCollection.where('email', '==', req.body.email).get();

            if (!customerUser.empty && originalText === req.body.password) {
                const user = customerUser.docs[0];
                const userType = "Customer";
                const uid = user.id;
                const userRef = customerCollection.doc(uid);
                await userRef.update({ status: true });
                res.send({ success: true, message: `Successfully reactivated ${userType}.` });
            }else {
                res.send({ success: false, message: "Invalid email or password", data: null });
            }
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: "Error... Please try again later.", data: null });
        }
    })
}


