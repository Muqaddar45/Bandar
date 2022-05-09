const express = require("express");
const PostModel = require("../model/postModel");
const router = express.Router();
const formidable = require("express-formidable");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config({path: "./../config.env"});

//config the cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//create post means Post Question api
router.post("/createPost" , async (req, res ) => {
    require("./../db/connect");
    let { post , userState , image } = req.body;
    if(!post){
        res.status(400).send("Question Text is required");
    }
    let user = userState.user;

    const postModelInstance = new PostModel ({
        text: post,
        postedBy: user._id,
        image
    });
    postModelInstance.save().then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send("Question isn't Posted");
    });
});
//end of posting api

//image upload
router.post("/uploadImagePost" , formidable({maxFileSize: 10 * 1024 * 1024 }) , async (req , res ) => {
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
//end of post uploading to cloudinary and sending to frontend

// Rendering Post from backend to frontend
router.get("/allPosts" , async (req , res ) => {
    require("./../db/connect");
    await PostModel.find().populate("postedBy" , "_id name image").sort({createdAt: -1}).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(400).send(err);
    })
});
//end of rendering posts

//Getting One post data
router.get("/getPost/:_id" , async (req , res ) => {
    require("./../db/connect");
    let postId = req.params._id;
    if(postId.charAt(0)==':'){
        postId = postId.slice(1);
    }
    await PostModel.findById(postId).then(data => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(400).send(err);
    });
});
//end of getting one post data

//updating api put
router.put("/updatePost/:_id" , async (req, res ) => {
    let postId = req.params._id;
    if(postId.charAt(0)==':'){
        postId = postId.slice(1);
    }
    const {text} = req.body;
    require("./../db/connect");
    PostModel.findByIdAndUpdate(postId , {text}).then(data => {
        res.status(200).send("Post, Updated Successfully!");
    }).catch(err => {
        res.status(400).send("Post, cannot Updated!");
    });
});
// end of post update api 

//deleting post api 
router.delete("/deletePost/:_id" , async (req , res ) => {
    var Id = req.params._id;
    require("./../db/connect");
    await PostModel.findByIdAndDelete(Id).then(data => {
        //removing from cloudinary
        if(data.image && data.image.public_id){
            cloudinary.uploader.destroy(data.image.public_id);
        }
        res.status(200).send("Post Deleted");
    }).catch(err => {
        res.status(400).send("Post isn't deleted");
    });
});
// end of delete post api

//get one user post api
router.get("/getOneUserPosts/:_id" , async (req , res ) => {
    const userId = req.params._id;
    require('./../db/connect');

    PostModel.find({postedBy: userId}).populate("postedBy" , "_id name image").sort({createdAt: -1}).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send("Post Isn't get");
    });

});
//end of get one user posts api

//handle like and unlike apis
router.post('/postLike' , async (req , res ) => {
    require("./../db/connect");
    let postId = req.body.postId;
    let userId = req.body.userId;
    await PostModel.findByIdAndUpdate(postId , { $addToSet: {likes: userId}}, {new: true}).populate("postedBy", "_id , name , image").then(data => {
        res.status(200).json(data);
    }).catch(err=> {
        res.status(400).send("Post dos'nt liked");
    });
});

router.post('/postUnlike' , async (req , res ) => {
    require("./../db/connect");
    let postId = req.body.postId;
    let userId = req.body.userId;

    await PostModel.findByIdAndUpdate(postId , { $pull: {likes: userId}}, {new: true}).then(data => {
        res.status(200).json(data);
    }).catch(err=> {
        res.status(400).send("Post dos'nt liked");
    });
});
//end of like and unlike apis

//get One post api
router.get("/getOnePost/:_id" , async (req , res ) => {
    let postId = req.params._id;
    if(postId.charAt(0)==':'){
        postId = postId.slice(1);
    }
    require("./../db/connect");

    PostModel.findById(postId).populate("postedBy" , "_id name image").populate("comments.postedBy" , "_id name image").then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send("Post not found");
    })
});
//end of getting post

//comment on post api
router.post("/commentOnPost/:_id" , async (req , res ) => {
    let userId = req.body.userId;
    let comment = req.body.comment;
    let postId = req.params._id;

    if(!comment){
        res.status(400).send("Comment is required");
    }
    require("./../db/connect");

    await PostModel.findByIdAndUpdate(postId , 
        {
            $push: { comments: {text: comment , postedBy: userId }}
        }
    ,
     {new: true}
    ).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        res.status(400).send("Comment isn't Added");
    });
    
});
//end of comment posting api


module.exports = router;