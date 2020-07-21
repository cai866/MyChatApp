const express = require('express');
const router = express.Router();

const PostCtrl = require('../controllers/posts');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/post/add-post', AuthHelper.VerifyToken, PostCtrl.addPost);
router.post('/posts', AuthHelper.VerifyToken, PostCtrl.getAllPosts);
router.post('/post/add-like', AuthHelper.VerifyToken, PostCtrl.addLike);

router.post('/post/add-comment', AuthHelper.VerifyToken, PostCtrl.addComment);
router.post('/post/:id', AuthHelper.VerifyToken, PostCtrl.getPost); //get a post with the :id

router.put('/post/edit-post', AuthHelper.VerifyToken, PostCtrl.editPost);
router.delete('/post/delete-post/:id', AuthHelper.VerifyToken, PostCtrl.deletePost);

module.exports = router;