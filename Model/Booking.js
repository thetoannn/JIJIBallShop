const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  time_slot: {
    day: { type: String, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true }
  },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
