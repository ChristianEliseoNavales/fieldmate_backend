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

    const today = new Date().toLocaleDateString();
    const existing = await Attendance.findOne({ email, date: today });
    if (existing) {
      return res.status(400).json({ message: 'Already timed in today' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
      hours: null, // ✅ initially null
      date: today,
      company: user.company,
      approved: false,
      denied: false,
      submitted: false,
    });

    const saved = await attendance.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error during time in:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// PUT /api/attendance/timeout/:id
const timeOut = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const timeOutFormatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const record = await Attendance.findById(id);
    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (!record.timeIn) {
      return res.status(400).json({ message: 'Time In not found for this record' });
    }

    // Parse both times as full Date objects
    const todayStr = new Date().toLocaleDateString();
    const timeInDate = new Date(`${todayStr} ${record.timeIn}`);
    const timeOutDate = new Date(`${todayStr} ${timeOutFormatted}`);

    let diffMs = timeOutDate - timeInDate;
    if (diffMs < 0) {
      diffMs += 12 * 60 * 60 * 1000; // handle AM/PM rollover if needed
    }

    const minutes = Math.floor(diffMs / 60000);
    const hoursStr = `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

    const updated = await Attendance.findByIdAndUpdate(
      id,
      {
        timeOut: timeOutFormatted,
        hours: hoursStr, // ✅ store calculated hours
      },
      { new: true }
    );

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

const getCompanyAttendances = async (req, res) => {
  const { email, date } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const filter = {
      company: user.company,
      approved: false,
      denied: false,
    };

    if (date) {
      filter.date = date;
    }

    const attendanceRecords = await Attendance.find(filter);
    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error('Error fetching company attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Attendance.findByIdAndUpdate(id, { approved: true }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Attendance not found' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error approving attendance:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const denyAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Attendance.findByIdAndUpdate(id, { denied: true }, { new: true });

    if (!updated) return res.status(404).json({ message: 'Attendance not found' });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error denying attendance:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

module.exports = { 
  getTodayAttendance, 
  timeIn, 
  timeOut, 
  submitAttendance, 
  getCompanyAttendances, 
  approveAttendance, 
  denyAttendance 
};
