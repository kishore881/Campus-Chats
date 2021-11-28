const mongoose = require('mongoose');
const day = 24*60*60*1000;

const PostSchema = new mongoose.Schema(
    {
        author:{
            type: String,
            required: [true, "author cannot be blank"],
            index: true,
        },
        authorName:{
            type: String, 
            required: [true, "author name is required"],
        },
        subject:{
            type: String,
            required: [true, "subject cannot be blank"],
        },
        post:{
            type: String,
            required: [true, "post cannot be blank"],
        },
        expiresAt:{
            type: Date,
            default: new Date(new Date + day)
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Post', PostSchema);