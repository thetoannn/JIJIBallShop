const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['new_post', 'post_report'], required: true },
  content: { type: String, required: true },
  related_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);