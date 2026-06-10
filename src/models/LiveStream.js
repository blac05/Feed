// src/models/LiveStream.js
import mongoose from 'mongoose';

const liveStreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  startTime: Date,
  endTime: Date,
  isActive: { type: Boolean, default: false },
});

const LiveStream = mongoose.model('LiveStream', liveStreamSchema);

// Export as default
export default LiveStream;
