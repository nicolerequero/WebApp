require('dotenv').config("./.env");
const express = require('express');
const jwt = require('jsonwebtoken');
var C = require("crypto-js");
const Admin = require("../models/admin");
const admin = require('firebase-admin');
const db = admin.firestore();
const { generateAdminAccessToken } = require('../helpers/generateAdminAccessToken');

const adminCollection = db.collection('Admins');

exports.changeGeneral = async (req, res) => {

    if (req.body.accessToken != undefined) {
        jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            // Parse admin ID from JWT payload
            const adminId = JSON.parse(decoded.admin_id).admin_id;
            // Get admin document reference by ID
            const adminRef = adminCollection.doc(adminId);

            // Get admin document snapshot
            const adminSnapshot = await adminRef.get();

            // Check if admin exists
            if (adminSnapshot.exists) {
                // Update admin document with new data
                const updateResult = await adminRef.update({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                });
    
                if (updateResult.writeTime !== null) {
                    // Get updated admin data and generate new access token
                    const updatedAdminSnapshot = await adminRef.get();
                    const updatedAdminData = updatedAdminSnapshot.data();
                    const updatedAdmin = new Admin(updatedAdminData, adminId);
                    const accessToken = generateAdminAccessToken(updatedAdmin);     
                            
                    res.send({ success: true, message: "Update General Info successfully.", data: { updatedAdmin, accessToken } });
                } else {
                    res.send({ success: false, message: "Failed to update General Info.", data: null });
                }
            } else {
                res.send({ success: false, message: "Admin not found.", data: null });
            }
        })
    }
}

exports.changeProfilePhotoOnly = async (req, res) => {
    if (req.body.accessToken != undefined) {
        jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            const adminId = JSON.parse(decoded.admin_id).admin_id;
            const adminRef = adminCollection.doc(adminId);
            const adminSnapshot = await adminRef.get();

            if (adminSnapshot.exists) {
                const updateResult = await adminRef.update({ image: req.body.image });

                if (updateResult.writeTime !== null) {
                    const updatedAdminSnapshot = await adminRef.get();
                    const updatedAdminData = { ...updatedAdminSnapshot.data(), image: req.body.image };
                    const updatedAdmin = new Admin(updatedAdminData, adminId);
                    console.log(updatedAdmin)
                    const accessToken = generateAdminAccessToken(updatedAdmin);
                    res.send({ success: true, message: "Profile photo updated successfully.", data: {updatedAdmin, accessToken } });
                } else {
                    res.send({ success: false, message: "Failed to update profile photo.", data: null });
                }
            } else {
                res.send({ success: false, message: "Admin not found.", data: null });
            }
        })
    }
}

exports.changePassword = async (req, res) => {
    if (req.body.accessToken != undefined) {
      jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        // Parse admin ID from JWT payload
        const adminId = JSON.parse(decoded.admin_id).admin_id;
        // Get admin document reference by ID
        const adminRef = adminCollection.doc(adminId);
  
        // Get admin document snapshot
        const adminSnapshot = await adminRef.get();
  
        // Check if admin exists
        if (adminSnapshot.exists) {
          // Decrypt and compare old password
          const adminData = adminSnapshot.data();
          const bytes = C.AES.decrypt(adminData.password, process.env.SECRET_KEY);
          const originalText = bytes.toString(C.enc.Utf8);
  
          if (originalText === req.body.password && adminData.password !== '') {
            // Encrypt and update new password
            const newPassword = C.AES.encrypt(req.body.newPassword, process.env.SECRET_KEY).toString();
            const updateResult = await adminRef.update({ password: newPassword });
  
            if (updateResult.writeTime !== null) {
              // Get updated admin data and generate new access token
              const updatedAdminSnapshot = await adminRef.get();
              const updatedAdminData = updatedAdminSnapshot.data();
              const updatedAdmin = new Admin(updatedAdminData, adminId);
              const accessToken = generateAdminAccessToken(updatedAdmin);
  
              res.send({ success: true, message: 'Password changed successfully.', data: { updatedAdmin, accessToken } });
            } else {
              res.send({ success: false, message: 'Failed to update password.', data: null });
            }
          } else {
            res.send({ success: false, message: 'The credentials provided do not match.', data: null });
          }
        } else {
          res.send({ success: false, message: 'Admin not found.', data: null });
        }
      });
    }
  };

  exports.changeInfo = async(req, res)=>{
    if(req.body.accessToken != undefined){
        jwt.verify(req.body.accessToken, process.env.ACCESS_TOKEN_SECRET, async(err, decoded)=>{
            
            const adminId = JSON.parse(decoded.admin_id).admin_id;
            const adminRef = adminCollection.doc(adminId);

            const adminSnapshot = await adminRef.get();

            if(adminSnapshot.exists){
                const updateResult = await adminRef.update({
                    gender: req.body.gender,
                    contact_no:req.body.contact_no,
                    birthday:req.body.birthday
                });
                
                if(updateResult.writeTime !== null){
                    const updatedAdminSnapshot = await adminRef.get();
                    const updatedAdminData = updatedAdminSnapshot.data();
                    const updatedAdmin = new Admin(updatedAdminData, adminId);
                    const accessToken = generateAdminAccessToken(updatedAdmin);
                    
                    res.send({success:true,message:"Update Info successfully.",data:{updatedAdmin,accessToken}});
                }else{
                    res.send({success:false,message:"Failed to update info.",data:null});
                }
            } else {
                res.send({ success: false, message: "Admin not found.", data: null });
            }
        })
    }
}

  