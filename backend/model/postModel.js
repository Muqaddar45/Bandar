const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const PostSchema = new mongoose.Schema (
    {

    text: {
        type: String,
        required: true
    },
    
    postedBy: {
        type: ObjectId,
        ref: "user",
    },
    
    image: {
        url: String,
        public_id: String
    },

    likes: [{
        type: ObjectId,
        ref: "user"
    }],
    
    comments: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            postedBy: {
                type: ObjectId,
                ref: "user",
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},

{
    timestamps: {
        createdAt: 'createdAt' , updatedAt: 'updatedAt'
    } 

}

);

const PostModel = mongoose.model("post" , PostSchema , "question");

module.exports = PostModel;