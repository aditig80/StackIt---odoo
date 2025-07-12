const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  author: { type: String, required: true },
  answers: [
    {
      text: String,
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      accepted: { type: Boolean, default: false },
      postedBy: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);