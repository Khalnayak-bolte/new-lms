const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    default: 'student'
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    console.log(`🔒 Hashing password for user: ${this.email}`);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('✅ Password hashed successfully.');
    next();
  } catch (err) {
    console.error('❌ Error hashing password:', err);
    next(err);
  }
});

// Compare passwords for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('🔍 Comparing entered password with stored hash...');
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(`🔁 Password match: ${isMatch}`);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
