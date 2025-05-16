const Attendance = require('../models/attendanceSchema');
const User = require('../models/userSchema');

const getTodayAttendance = async (req, res) => {
  const { email } = req.query;
  const today = new Date().toLocaleDateString();

  try {
    const record = await Attendance.findOne({ email, date: today });
    if (record) {
      return res.status(200).json(record);
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error checking today\'s attendance', error: err });
  }
};

// POST /api/attendance/timein
const timeIn = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if record already exists for today
    const today = new Date().toLocaleDateString();
    const existing = await Attendance.findOne({ email, date: today });
    if (existing) {
      return res.status(400).json({ message: 'Already timed in today' });
    }

    // Get user info
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format timeIn as "hh:mm AM/PM"
    const now = new Date();
    const timeInFormatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const attendance = new Attendance({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      timeIn: timeInFormatted,
      timeOut: null,
      date: today,
      company: user.company,
      approved: false,
      denied: false,
    });

    const saved = await attendance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error during time in:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const timeOut = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const timeOutFormatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const updated = await Attendance.findByIdAndUpdate(
      id,
      { timeOut: timeOutFormatted },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Time out error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// PUT /api/attendance/submit/:id
const submitAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Attendance.findByIdAndUpdate(
      id,
      { submitted: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("Error submitting attendance:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};


module.exports = { getTodayAttendance, timeIn, timeOut, submitAttendance };
