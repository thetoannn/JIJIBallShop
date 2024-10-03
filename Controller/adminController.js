const Post = require('../Model/Post');
const AdminNotification = require('../Model/AdminNotification');
const Notification = require('../Model/Notification');
const mongoose = require('mongoose');

// Admin xem chi tiết bài đăng
exports.getPostDetails = async (req, res, next) => {
    const postId = req.params.post_id;
  
    // Kiểm tra xem postId có phải là ObjectId hợp lệ không
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: 'ID bài đăng không hợp lệ' });
    }
  
    try {
      const post = await Post.findById(postId).populate('user_id', 'username profile.name');
      if (!post) {
        return res.status(404).json({ error: 'Không tìm thấy bài đăng' });
      }
      res.json(post);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết bài đăng:', error);
      next(error); // Gọi middleware xử lý lỗi tiếp theo
    }
  };

// Admin duyệt hoặc từ chối bài đăng
exports.updatePostStatus = async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['approved', 'rejected'];

  // Kiểm tra trạng thái
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    // Cập nhật trạng thái bài đăng
    const post = await Post.findByIdAndUpdate(
      req.params.post_id,
      { status, updated_at: new Date() },
      { new: true, runValidators: true }
    );

    // Kiểm tra xem bài đăng có tồn tại không
    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài đăng' });
    }

    // Gửi thông báo cho người dùng về trạng thái bài đăng
    await Notification.create({
      user_id: post.user_id,
      content: `Bài đăng của bạn đã được ${status === 'approved' ? 'duyệt' : 'từ chối'}.`,
      related_post_id: post._id,
      created_at: new Date(),
      is_read: false
    });

    // Xóa thông báo AdminNotification nếu có
    await AdminNotification.findOneAndDelete({ related_id: post._id, type: 'new_post' });

    res.json({ 
      message: `Bài đăng đã được ${status === 'approved' ? 'duyệt' : 'từ chối'}`, 
      post 
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái bài đăng:', error);
    next(error); // Gọi middleware xử lý lỗi tiếp theo
  }
};
