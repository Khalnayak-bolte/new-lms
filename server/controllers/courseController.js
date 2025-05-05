const Course = require('../models/Course');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new course (Multer-compatible)
exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const instructorId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const uploadedFiles = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: 'lms_courses',
          resource_type: 'auto',
        });

        uploadedFiles.push({
          url: uploadResult.secure_url,
          type: uploadResult.resource_type,
        });

        fs.unlinkSync(file.path);
      }
    }

    const newCourse = new Course({
      title,
      description,
      instructor: instructorId,
      materials: uploadedFiles,
    });

    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error while creating course' });
  }
};

// ✅ Get all courses (public)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
};

// ✅ Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error while fetching course' });
  }
};

// ✅ Enroll in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'Enrolled in course successfully' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error while enrolling' });
  }
};

// ✅ Get courses a student is enrolled in
exports.getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error while fetching enrolled courses' });
  }
};
