const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Middleware to check instructor role
function isInstructor(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'instructor') return res.sendStatus(403);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
}

// Create course with media uploads
router.post('/create', isInstructor, upload.array('files', 10), async (req, res) => {
  try {
    const { title, description } = req.body;
    const media = req.files.map(file => ({
      url: file.path,
      type: file.mimetype.split('/')[0] === 'application' ? 'pdf' : file.mimetype.split('/')[0],
      filename: file.originalname
    }));

    const newCourse = new Course({
      title,
      description,
      instructor: req.userId,
      media
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created', course: newCourse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.post('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

module.exports = router;
