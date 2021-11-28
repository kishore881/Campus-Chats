const route = require('express').Router();
const middlewares = require('../middlewares');
const { celebrate, Joi } = require('celebrate');
const winston = require('winston');

module.exports = ({app, postService}) => {
    app.use('/post', middlewares.isAuthenticated);
    app.use('/post', route);

    route.post(
        '/', 
        celebrate({
            body: Joi.object({
                subject: Joi.string().required(),
                post: Joi.string().required(),
                expiry: Joi.number().required()
            }),
        }),
        async (req, res) => {
        try {
            const {subject, post, expiry} = req.body;
            const postRecord = await postService.createPost(req.token._id, req.token.email, subject, post, expiry);
            
            winston.debug(`User ${req.token._id} created post ${postRecord._id}`);
            
            res.json({message: 'Post created', post:postRecord}).end();
        } catch (err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });

    route.get('/getall', async (req, res) => {
        try {
            const posts = await postService.getLivePosts();
            res.json({message: 'All Live Posts', posts}).end();
        } catch (err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });

    route.get('/getbyuser', async (req, res) => {
        try {
            const posts = await postService.getLivePostsByUser(req.token._id);
            res.json({message: "User's Live Posts", posts}).end();
        } catch (err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });

    route.put(
        '/:id',
        celebrate({
            body: Joi.object({
                id: Joi.string().required() ,
                subject: Joi.string().required(),
                post: Joi.string().required(),
            }),
        }),
        async (req, res) => {
        try {        
            const {id, subject, post} = req.params;
            const postRecord = await postService.updatePost({userId: req.token.id, postId: id, subject, post});
            return res.json({message: 'Post created', postRecord}).end();
        } catch (err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });

    route.delete('/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const post = await postService.deletePost(req.token._id, id);
            winston.debug(`User ${req.token._id} deleted post ${post._id}`);
            return res.json({status: 'deleted', post});
        } catch (err) {
            return res.json({status: 401, message: err.message}).end();
        }
    });
}