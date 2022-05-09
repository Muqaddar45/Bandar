const mongoose = require("mongoose");

const userSchema = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    image: {
        url: String,
        public_id: String
    },
    role: {
        type: String,
        default: "Subscriber",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
};
const userModel = mongoose.model("user" , userSchema , "user");
module.exports = userModel;