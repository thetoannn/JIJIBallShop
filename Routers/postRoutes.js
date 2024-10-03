const express = require('express');
const {authenticateUser,authenticateAdmin} = require('../Middleware/authMiddleware');
const { createPost,
    editPost,
    listAllPosts,
    getPostDetails } = require('../Controller/postControllers');
const router = express.Router();

router.post('/create', authenticateUser, createPost);
router.put('/:id', authenticateUser, editPost);
router.get('/', listAllPosts);
router.get('/:id', getPostDetails);


module.exports = router;