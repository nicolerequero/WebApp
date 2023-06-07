require('dotenv').config("./.env");
const jwt = require('jsonwebtoken');


exports.generateAdminAccessToken = (admin) =>{
    return jwt.sign({admin_id: JSON.stringify(admin)},process.env.ACCESS_TOKEN_SECRET)
}