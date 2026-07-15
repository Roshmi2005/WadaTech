import Feedback from "../models/Feedback.js";

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback
 * @access  Private (citizen)
 */
export const submitFeedback = async (req, res) => {
  try {
    const { subject, rating, message } = req.body;

    const feedback = await Feedback.create({
      citizenId: req.user._id,
      subject,
      rating,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: { feedback },
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting feedback",
    });
  }
};

/**
 * @route   GET /api/feedback
 * @desc    View logged-in citizen's feedback logs
 * @access  Private (citizen)
 */
export const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      citizenId: req.user._id,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: { feedbacks },
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching feedback",
    });
  }
};

/**
 * @route   GET /api/feedback/:id
 * @desc    View single feedback entry
 * @access  Private (citizen — own)
 */
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { feedback },
    });
  } catch (error) {
    console.error("Get feedback by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching feedback",
    });
  }
};

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Soft-delete own feedback
 * @access  Private (citizen)
 */
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    feedback.isDeleted = true;
    await feedback.save();

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting feedback",
    });
  }
};
