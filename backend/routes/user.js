const { json } = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('./../model/userModel');
const jwt = require("jsonwebtoken");
const {checkingUserMiddleware} = require("./../middlewares");
const formidable = require("express-formidable");
const multer = require('multer');
const cloudinary = require("cloudinary");


const router = express.Router();
//config the cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//Register new User api
router.post("/register" , async (req , res ) => {
    require("./../db/connect");
    const {name , email , phoneNumber , password } = req.body;

    //validation
    const existE = await userModel.findOne({email});
    const existP = await userModel.findOne({phoneNumber});
    if(!name){
        res.status(400).send("Name is required");
    }
    else if(!email){
        res.status(400).send("Email is required");
    }
    else if(!phoneNumber){
        res.status(400).send("Phone Number is required");
    }
    else if(existE){
        res.status(400).send("Email is already taken");
    }
    else if(existP){
        res.status(400).send("Phone Number is already taken");
    }
    else if(password.length < 6){
        res.status(400).send("Password is less than 6 characters");
    }
    else if(!phoneNumber || phoneNumber.length != 10 || phoneNumber.charAt(0) != 0 || phoneNumber.charAt(1) != 7){
        res.status(400).send("Phone Number should be 10 digits and starts with (07)");
    }
    //end of validation

    //Hashing Password for saving in DB
    else{
    const hashPassword = (password) => {
        return new Promise( ( resolve , reject ) => {
            bcrypt.genSalt(12 , (err , salt ) => {
                if(err){
                    reject(err);
                }
                bcrypt.hash(password , salt , (err , hashed) => {
                    if(err){
                        reject(err);
                    }
                    resolve(hashed);
                });
            });
        });
    }
    ////////////
    const hashedPassword = await hashPassword(password);
    const userModelInstance = new userModel({
        name,
        email,
        phoneNumber,
        password: hashedPassword
    });
    userModelInstance.save().then((data) => {
    console.log("Data saved in DB");
    res.status(200).send(data);
}).catch((err) => {
    res.status(400).send(err);
});
}
});
//user Register api end

//Login user api
router.post("/login" , async (req , res ) => {
    try{
        const {email , password } = req.body;
        require('./../db/connect');
        const user = await userModel.findOne({email});
        if(!user){
            res.status(400).send("On this Email Account not found");
        }
        const match = await bcrypt.compare(password , user.password);
        if(!match){
            res.status(400).send("Password is Wrong");
        }

        const token = jwt.sign({_id: user._id} , process.env.JWT_SECRET , {
            expiresIn: "1200d"
        });
        user.password = undefined;
        user.phoneNumber = undefined;

        res.status(200).send({
            token,
            user
        });

    } catch(err) {
        if(err){
        res.status(400).send(err);
        console.log(err);
        }
    }
});
//Login user api end

// // get Current User for protecting routes
router.get("/getCurrentUser" , checkingUserMiddleware  , async (req , res ) => {
    try{
        require('./../db/connect');
        const user = await userModel.findById(req.user._id);
        res.send(user);
    }catch(err){
        res.status(400).send("Invalid User and token");
    }
});


router.post("/profilePicUpload" , formidable({maxFileSize: 10 * 1024 * 1024 }) , async (req , res ) => {
    // console.log(req.files);
    await cloudinary.uploader.upload(req.files.image.path).then(result => {
        res.json({
            url: result.secure_url,
            public_id: result.public_id
        });
    }).then(err=>{
        res.status(400).send(err);
    });

});
//end of file uploading 

// save profile path into db
router.put("/profilePicUpdate/:_id" , async (req , res ) => {
    let _id = req.params._id;
    if(_id.charAt(0)==':'){
        _id = _id.slice(1);
    }
    console.log(req.body);
    console.log(_id);
    require("./../db/connect");
    
    userModel.findByIdAndUpdate(_id,req.body).then(data => {
        res.status(200).send("Profile Picture Set.");
    }).catch(err => {
        res.status(400).send("Profile Picture not set");
    });
});
//end of file save in db


//get One user Information from db api
router.get("/getOneUser/:_id", async (req , res ) => {
    const userId = req.params._id;
    require('./../db/connect');

    userModel.findById(userId).then(data => {
        const user = data;
        res.status(200).json(user);
    }).catch(err => {
        res.status(400).send("User Profile Not found");
    })
});
// end of getting one user information

// updating uses Profile
router.put("/userProfile/:_id" , async (req , res ) => {
    const userId = req.params._id;
    const user = req.body;
    require("./../db/connect");
    await userModel.findByIdAndUpdate(userId , user).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send(err);
    })
});
//end of user update profile

// getting all users of the application
router.get("/AllUsers" , async (req , res ) => {
    require("../db/connect");
    userModel.find().sort({createdAt: -1}).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(200).send("No User Found");
    });
})
// end of getting all users

// delete one user 
router.delete("/deleteUser/:id" , async (req , res ) => {
    require("./../db/connect");
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if(!user){
        res.status(400).send("No User found on this Id: "+userId);
    }
    if(user && user.role == "Admin"){
        res.status(400).send("You can't delete an Admin.");
    }
    await userModel.findByIdAndRemove(userId).then(data => {
        res.status(200).send("user Deleted");
    }).catch(err => {
        res.status(400).send("User isn't Deleted");
    });
})
// end of deleting user
module.exports = router;