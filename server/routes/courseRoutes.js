const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  enrollInCourse
} = require('../controllers/courseController');

const {
  authenticateUser,
  authorizeRoles
} = require('../middleware/authMiddleware');

// Multer for handling multipart/form-data
const upload = multer({ dest: 'uploads/' });

// 📚 Public - View all courses
router.post('/', getAllCourses);

// 👤 Student - View enrolled courses
router.post('/enrolled', authenticateUser, authorizeRoles('student'), getEnrolledCourses);

// ✅ Student - Enroll in a course
router.post('/enroll/:courseId', authenticateUser, authorizeRoles('student'), enrollInCourse);

// 🧑‍🏫 Instructor - Create course with file upload
router.post(
  '/create',
  authenticateUser,
  authorizeRoles('instructor'),
  upload.array('files'),
  createCourse
);

// 🔍 Public - Get course by ID
 router.post('/:id', getCourseById);

module.exports = router;
