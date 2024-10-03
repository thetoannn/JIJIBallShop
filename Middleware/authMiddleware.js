const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../Model/User');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Không có token, từ chối truy cập' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    req.user = user; // Lưu thông tin người dùng
    next(); // Chuyển sang middleware hoặc route tiếp theo
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    res.status(401).json({ error: 'Xác thực thất bại' });
  }
};

const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ error: 'Không có quyền truy cập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    // console.log('User:', user); // Kiểm tra thông tin người dùng

    // Kiểm tra xem người dùng có phải là admin hay không
    if (!user || user.role !== 'admin') {
      console.log('Người dùng không phải admin hoặc không tồn tại');
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }

    req.user = user; // Lưu thông tin người dùng vào req để sử dụng sau này
    next();
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    res.status(403).json({ error: 'Token không hợp lệ hoặc xác thực thất bại' });
  }
};

module.exports = { authenticateUser, authenticateAdmin };
