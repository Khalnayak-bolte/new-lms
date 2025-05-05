// server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// 🔴 Get all users except admin
router.get('/users', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// 🔴 Delete one course by ID
router.delete('/course/:id', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course' });
  }
});

// 🔴 Clear all courses
router.delete('/courses/clear', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    await Course.deleteMany({});
    res.json({ message: 'All courses cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear courses' });
  }
});

// 🔴 Delete one assignment by ID
router.delete('/assignment/:id', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting assignment' });
  }
});

// 🔴 Clear all assignments
router.delete('/assignments/clear', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    await Assignment.deleteMany({});
    res.json({ message: 'All assignments cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear assignments' });
  }
});

// 🔴 Delete one user (excluding admin)
router.delete('/user/:id', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin or user not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// 🔴 Clear all users except admin
router.delete('/users/clear', authenticateUser, authorizeRoles('admin'), async (req, res) => {
  try {
    await User.deleteMany({ role: { $ne: 'admin' } });
    res.json({ message: 'All users (except admin) deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing users' });
  }
});

module.exports = router;
