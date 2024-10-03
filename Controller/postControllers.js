const Post = require('../Model/Post');
const AdminNotification = require('../Model/AdminNotification');

// Tạo bài mới và gửi thông báo đến admin
exports.createPost = async (req, res) => {
  try {
    const {
      court_address,
      group_type,
      images,
      total_players,
      court_type,
      players_needed,
      skill_level,
      time,
      cost,
      contact_info
    } = req.body;

    const newPost = new Post({
      user_id: req.user._id,
      court_address,
      group_type,
      images,
      total_players,
      court_type,
      players_needed,
      skill_level,
      time,
      cost,
      contact_info
    });

    await newPost.save();

    // Gửi thông báo cho admin về bài đăng mới
    await AdminNotification.create({
      type: 'new_post',
      content: `Bài đăng mới được tạo bởi ${req.user.username}`,
      related_id: newPost._id
    });

    res.status(201).json({ message: 'Tạo bài đăng thành công', post: newPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Chỉnh sửa bài đăng
exports.editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updated_at = Date.now();

    const post = await Post.findOneAndUpdate(
      { _id: id, user_id: req.user._id },
      updateData,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài đăng hoặc bạn không có quyền chỉnh sửa' });
    }

    res.json({ message: 'Cập nhật bài đăng thành công', post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Hiển thị tất cả các bài đăng được duyệt
exports.listAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'approved' })
      .populate('user_id', 'username profile.name')
      .sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lấy chi tiết bài đăng
exports.getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate('user_id', 'username profile.name profile.skill_level profile.phone_number profile.facebook_link');
    
    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài đăng' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// exports.approvePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Post.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     res.json({ message: 'Post approved successfully', post });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
// exports.rejectPost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Post.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });

//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }

//     res.json({ message: 'Post rejected successfully', post });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };