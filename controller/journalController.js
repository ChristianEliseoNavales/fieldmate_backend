const Journal = require('../models/journalSchema');
const User = require('../models/userSchema'); 

// POST /api/journal
const createJournal = async (req, res) => {
  try {
    const { content, email } = req.body;

    if (!content || !email) {
      return res.status(400).json({ message: 'Content and email are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found for the given email' });
    }

    const newEntry = new Journal({
      content,
      firstName: user.firstName,
      lastName: user.lastName,
      company: user.company,
      createdAt: new Date()
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error('Error saving journal:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};

const getTodayJournal = async (req, res) => {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
  
      const end = new Date();
      end.setHours(23, 59, 59, 999);
  
      const todayEntry = await Journal.findOne({
        createdAt: { $gte: start, $lte: end }
      });
  
      if (todayEntry) {
        res.status(200).json(todayEntry);
      } else {
        res.status(204).send(); // No Content
      }
    } catch (err) {
      console.error('Error fetching today\'s journal:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  };

  const getJournalsByCompany = async (req, res) => {
  const { email } = req.query;

    try {
      const user = await User.findOne({ email });
      if (!user || !user.company) {
        return res.status(404).json({ message: 'User or company not found' });
      }

      const journals = await Journal.find({ company: user.company }).sort({ createdAt: -1 });
      res.status(200).json(journals);
    } catch (err) {
      console.error('Error fetching journals by company:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  };

  const getUserByEmail = async (req, res) => {
    const email = req.query.email;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user); // <-- this is what your frontend expects
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

module.exports = {
  createJournal,
  getTodayJournal,
  getJournalsByCompany,
  getUserByEmail,
};
