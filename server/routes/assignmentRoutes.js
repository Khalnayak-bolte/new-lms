const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const assignmentController = require('../controllers/assignmentController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Ensure the uploads/assignments directory exists
const uploadPath = path.join(__dirname, '..', 'uploads', 'assignments');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Instructor creates assignment
router.post(
  '/create',
  authenticateUser,
  authorizeRoles('instructor'),
  assignmentController.createAssignment
);

// ✅ Student submits assignment (with file upload)
router.post(
  '/submit/:id',
  authenticateUser,
  authorizeRoles('student'),
  upload.single('file'), // input name = "file"
  assignmentController.submitAssignment
);

// ✅ Instructor grades an assignment
router.post(
  '/grade',
  authenticateUser,
  authorizeRoles('instructor'),
  assignmentController.gradeSubmission
);

// ✅ Fetch all assignments
router.get(
  '/',
  authenticateUser,
  assignmentController.getAllAssignments
);

module.exports = router;
