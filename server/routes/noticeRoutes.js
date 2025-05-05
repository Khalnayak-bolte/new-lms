const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Create a notice (Admin or Instructor only)
router.post(
  '/',
  authenticateUser,
  authorizeRoles('admin', 'instructor'),
  noticeController.createNotice
);

// Get all notices (any user)
router.get('/', noticeController.getAllNotices);

module.exports = router;
