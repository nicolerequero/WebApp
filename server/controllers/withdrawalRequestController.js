
const WithdrawalRequest = require("../models/withdrawalRequest");
var C = require("crypto-js");
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const db = admin.firestore();

const withdrawCollection = db.collection('WithdrawalRequests');
const customerCollection = db.collection('Users');
const itinerantCollection = db.collection('Itinerants');
const walletCollection = db.collection('Wallet');

exports.getAllWithdrawalRequests = async (req, res) => {
  try {
    const withdrawsSnapshot = await withdrawCollection
      .where('withdrawal_status', '==', 1)
      .orderBy('withdrawal_timestampSent', 'desc')
      .get();

    const approvedWithdrawsSnapshot = await withdrawCollection
      .where('withdrawal_status', '==', 2)
      .orderBy('withdrawal_timestampSent', 'desc')
      .get();

    const withdrawDocs = withdrawsSnapshot.docs;
    const approvedWithdrawDocs = approvedWithdrawsSnapshot.docs;

    const withdrawPromises = [];
    const approvedWithdrawPromises = [];

    // Retrieve user details and wallet balance for pending withdraws
    for (const withdrawDoc of withdrawDocs) {
      const withdrawData = withdrawDoc.data();

      if (withdrawData.withdrawal_itinid != null) {
        const itineraryPromise = itinerantCollection.doc(withdrawData.withdrawal_itinid).get();
        const walletPromise = walletCollection
          .where('itin_id', '==', withdrawData.withdrawal_itinid)
          .limit(1)
          .get();
        withdrawPromises.push(Promise.all([itineraryPromise, walletPromise]));
      } else if (withdrawData.withdrawal_userid != null) {
        const customerPromise = customerCollection.doc(withdrawData.withdrawal_userid).get();
        const walletPromise = walletCollection
          .where('cust_id', '==', withdrawData.withdrawal_userid)
          .limit(1)
          .get();
        withdrawPromises.push(Promise.all([customerPromise, walletPromise]));
      }
    }

    // Retrieve user details for approved withdraws
    for (const approvedWithdrawDoc of approvedWithdrawDocs) {
      const approvedWithdrawData = approvedWithdrawDoc.data();

      if (approvedWithdrawData.withdrawal_itinid != null) {
        const itineraryPromise = itinerantCollection.doc(approvedWithdrawData.withdrawal_itinid).get();
        approvedWithdrawPromises.push(itineraryPromise);
      } else if (approvedWithdrawData.withdrawal_userid != null) {
        const customerPromise = customerCollection.doc(approvedWithdrawData.withdrawal_userid).get();
        approvedWithdrawPromises.push(customerPromise);
      }
    }

    const withdrawResults = await Promise.all(withdrawPromises);
    const approvedWithdrawSnapshots = await Promise.all(approvedWithdrawPromises);

    const withdraws = [];
    const approvedWithdraws = [];

    // Process pending withdraws and user details
    for (let i = 0; i < withdrawResults.length; i++) {
      const withdrawDoc = withdrawDocs[i];
      const withdrawData = withdrawDoc.data();
      const [userDetailsSnapshot, walletSnapshot] = withdrawResults[i];

      if (userDetailsSnapshot.exists) {
        const userDetails = userDetailsSnapshot.data();
        let currentBalance = null;

        if (walletSnapshot && !walletSnapshot.empty) {
          const walletData = walletSnapshot.docs[0].data();
          currentBalance = walletData.wal_balance;
        }

        if (currentBalance !== null) {
          const withdraw = new WithdrawalRequest(withdrawData, withdrawDoc.id);
          withdraw.userDetails = userDetails;
          withdraw.type = withdrawData.withdrawal_itinid != null ? 'Itinerant' : 'Customer';
          withdraw.balance = currentBalance;
          withdraws.push(withdraw);
        }
      }
    }

    // Process approved withdraws and user details
    for (let i = 0; i < approvedWithdrawSnapshots.length; i++) {
      const approvedWithdrawDoc = approvedWithdrawDocs[i];
      const approvedWithdrawData = approvedWithdrawDoc.data();
      const userDetails = approvedWithdrawSnapshots[i].data();

      const approvedWithdraw = new WithdrawalRequest(approvedWithdrawData, approvedWithdrawDoc.id);
      approvedWithdraw.userDetails = userDetails;
      approvedWithdraw.type = approvedWithdrawData.withdrawal_itinid != null ? 'Itinerant' : 'Customer';
      approvedWithdraws.push(approvedWithdraw);
    }
    console.log(approvedWithdraws);
    res.send({ success: true, data: { withdraws, approvedWithdraws } });
  } catch (error) {
    console.error('Error retrieving withdrawal requests:', error);
    res.status(500).send({ success: false, error: 'Internal server error' });
  }
};


exports.approveWithdrawalRequest = async (req, res) => {
  jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {

    // If JWT contains an admin ID
    var decodedData = JSON.parse(decoded.admin_id);

    var bytes = C.AES.decrypt(decodedData.password, process.env.SECRET_KEY);
    var originalText = bytes.toString(C.enc.Utf8);

    try {

      if (originalText === req.body.password) {
        const ref = withdrawCollection.doc(req.body.withdrawal_request_id);
    
        if (req.body.withdrawal_userid != null) {
          const walletQuery = await walletCollection
            .where('cust_id', '==', req.body.withdrawal_userid)
            .limit(1)
            .get();
          const doc = walletQuery.docs[0];
          const walletData = doc.data()
          const currentBalance = walletData.wal_balance;
        
          if (currentBalance >= req.body.withdraw) {
            const updatedBalance = currentBalance - req.body.withdraw;
            await doc.ref.update({ wal_balance: updatedBalance }); 
            await ref.update({ withdrawal_status: 2 });
            res.send({ success: true, message: `Successfully approved.` });
          } else {
            res.send({ success: false, message: `Insufficient balance for withdrawal.` });
          }
        }else if (req.body.withdrawal_itinid != null) {
          const walletQuery = await walletCollection
            .where('itin_id', '==', req.body.withdrawal_itinid)
            .limit(1)
            .get();
            const doc = walletQuery.docs[0];
            const walletData = doc.data()
            const currentBalance = walletData.wal_balance;
            if (currentBalance >= req.body.withdraw) {
              const updatedBalance = currentBalance - req.body.withdraw;
              await doc.ref.update({ wal_balance: updatedBalance }); 
              await ref.update({ withdrawal_status: 2 });
              res.send({ success: true, message: `Successfully approved.` });
            } else {
              res.send({ success: false, message: `Insufficient balance for withdrawal.` });
            }
        }
      } else {
        res.send({ success: false, message: "Invalid password", data: null });
      }
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: "Invalid password", data: null });
    }
  })
}


exports.discardWithdrawalRequest = async (req, res) => {
  jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {

    // If JWT contains an admin ID
    var decodedData = JSON.parse(decoded.admin_id);

    var bytes = C.AES.decrypt(decodedData.password, process.env.SECRET_KEY);
    var originalText = bytes.toString(C.enc.Utf8);

    try {

      if (originalText === req.body.password) {
        const ref = withdrawCollection.doc(req.body.withdrawal_request_id);
        await ref.update({ withdrawal_status: 3 });
        res.send({ success: true, message: `Successfully discarded.` });
      } else {
        res.send({ success: false, message: "Invalid password", data: null });
      }
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: "Invalid password", data: null });
    }
  })
}

