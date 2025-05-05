const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.post('/signup', (req, res, next) => {
  console.log('📩 Incoming signup request:', req.body);
  authController.signup(req, res, next);
});

router.post('/login', (req, res, next) => {
  console.log('🔐 Incoming login request:', req.body);
  authController.login(req, res, next);
});

module.exports = router;
