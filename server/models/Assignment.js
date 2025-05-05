// server/models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answer: String,
      submittedAt: { type: Date, default: Date.now },
      grade: String,
      feedback: String,
      late: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Assignment', assignmentSchema);
