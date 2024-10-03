const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  related_post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
