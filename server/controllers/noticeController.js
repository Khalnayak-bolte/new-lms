const Notice = require('../models/Notice');

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    const createdBy = req.user.id;

    const notice = new Notice({
      title,
      content,
      createdBy,
    });

    await notice.save();
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().populate('createdBy', 'name role').sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
