const jwt = require("jsonwebtoken");
const USER = require("../models/userSchema");
const keysecret = "VHVHBHGHVHT767YFVHT7T7UFYHGUYUYFGCYTU7UGYFCGHFY57UY"

const authenicate = async(req,res,next)=>{
    try {
        const token = req.cookies.Amazon;

        const verifyToken = jwt.verify(token,keysecret);

        const rootUser = await USER.findOne({_id:verifyToken._id,"tokens.token":token});
        
        if(!rootUser){ throw new Error("User Not Found") };
        req.token = token; 
        req.rootUser = rootUser;   
        req.userID = rootUser._id;   
        next();  
    } catch (error) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(error);
    }
};

module.exports = authenicate;