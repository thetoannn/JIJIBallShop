const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');
const { authenticateAdmin } = require('../Middleware/authMiddleware');

// Admin xem chi tiết bài đăng
router.get('/posts/:post_id', authenticateAdmin, adminController.getPostDetails);

// Admin duyệt hoặc từ chối bài đăng
router.put('/posts/:post_id/status', authenticateAdmin, adminController.updatePostStatus);

module.exports = router;
