const winston = require('winston');
const postModel = require('../models/post');
const hour = 60*60*1000;

function getNamefromMail(email){
    return email.substring(0, email.indexOf("@"));
}

async function createPost(_id, email, subject, content, expiry){
    try {
        const expiresAt = new Date(new Date().getTime() + expiry*hour);
        const postRecord = await postModel.create({author: _id, authorName: getNamefromMail(email), subject, post: content, expiresAt});
        
        if(!postRecord){
            throw new Error('Failed to create new post');
        }

        const post = postRecord.toObject();
        return post;
    } catch (err) {
        winston.error(err);
        throw err;
    }
}

async function getLivePosts(){
    try {
        const posts = await postModel.find({expiresAt: {$gt: new Date()}}).sort({createdAt: 0});
        return posts;
    } catch (err) {
        winston.error(err);
        throw err;
    }
}

async function getLivePostsByUser(_id){
    try {
        const posts = await postModel.find({author: _id, expiresAt: {$gt: new Date()}}).sort({expiresAt: 0});
        return posts;
    } catch (err) {
        winston.error(err);
        throw err;
    }
}

async function updatePost({userId, postId, subject, content}){
    try {
        const postRecord = await postModel.findOneAndUpdate({author: userId, _id: postId}, {subject, post: content});
        
        if(!postRecord){
            throw new Error('No Post found to update.');
        }

        const post = postRecord.toObject();
        return post;        
    } catch (err) {
        winston.error(err);
        throw err;
    }

}

async function deletePost(author, _id){
    try {
        const postRecord = await postModel.findOneAndDelete({author, _id}, {returnDocument: true});
        
        if(!postRecord){
            throw new Error('No Post found to delete.');
        }
    
        const post = postRecord.toObject();
        return post; 
    } catch (err) {
        winston.error(err);
        throw err;
    }
}

module.exports = {createPost, getLivePosts, getLivePostsByUser, updatePost, deletePost}