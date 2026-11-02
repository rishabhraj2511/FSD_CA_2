const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');

async function createFeedback(req, res, next) {
  try {
    const body = req.body || {};
    const feedback = await Feedback.create({
      studentName: body.studentName,
      courseName: body.courseName,
      message: body.message,
      rating: body.rating,
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    next(error);
  }
}

async function getFeedback(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const [feedback, totalRecords] = await Promise.all([
      Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(),
    ]);

    res.status(200).json({
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      feedback,
    });
  } catch (error) {
    next(error);
  }
}

async function updateFeedbackStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid feedback ID' });
    }

    const { status } = req.body || {};
    if (!['Pending', 'Reviewed'].includes(status)) {
      return res.status(400).json({ error: 'status must be either Pending or Reviewed' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback record not found' });
    }

    res.status(200).json({ message: 'Feedback status updated successfully', feedback });
  } catch (error) {
    next(error);
  }
}

module.exports = { createFeedback, getFeedback, updateFeedbackStatus };
