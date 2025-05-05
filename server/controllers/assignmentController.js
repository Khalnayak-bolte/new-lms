// server/controllers/assignmentController.js
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload utility
const uploadToCloudinary = async (filePath, folder) => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto',
  });
};

// ✅ Create Assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, course } = req.body;

    if (!title || !description || !deadline || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newAssignment = new Assignment({
      title,
      description,
      deadline,
      course,
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error while creating assignment' });
  }
};

// ✅ Submit Assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'You already submitted this assignment.' });
    }

    const answerUrl = `/uploads/assignments/${file.filename}`;

    assignment.submissions.push({
      student: studentId,
      answer: answerUrl,
      submittedAt: new Date(),
      late: new Date() > new Date(assignment.deadline),
    });

    await assignment.save();

    res.status(200).json({ message: 'Assignment submitted successfully.' });
  } catch (err) {
    console.error('❌ Error submitting assignment:', err);
    res.status(500).json({ message: 'Server error while submitting assignment.' });
  }
};


// ✅ Grade Submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId, grade, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    );
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;

    await assignment.save();
    res.status(200).json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: 'Error grading submission' });
  }
};

// ✅ Get All Assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course', 'title')
      .populate('submissions.student', 'name email');
    res.status(200).json(assignments);
  } catch (err) {
    console.error('Get assignments error:', err);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};
