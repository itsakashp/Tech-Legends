const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isCommentAuthor} = require('../middleware')
const comments = require('../controllers/comments');

router.post('/legends/:id/comments', isLoggedIn, catchAsync(comments.newComment))

router.delete('/legends/:lid/comments/:cid', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;

