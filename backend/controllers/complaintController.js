import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";

/**
 * @route   POST /api/complaints
 * @desc    Submit a new complaint
 * @access  Private (citizen)
 */
export const submitComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const attachments = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const complaint = await Complaint.create({
      citizenId: req.user._id,
      title,
      description,
      category,
      attachments,
      status: "Pending",
    });

    await Notification.create({
      citizenId: req.user._id,
      title: "Complaint Submitted",
      message: `Your complaint "${title}" has been registered and is pending review.`,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      data: { complaint },
    });
  } catch (error) {
    console.error("Submit complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting complaint",
    });
  }
};

/**
 * @route   GET /api/complaints
 * @desc    List logged-in citizen's complaints
 * @access  Private (citizen)
 */
export const getMyComplaints = async (req, res) => {
  try {
    const filter = {
      citizenId: req.user._id,
      isDeleted: false,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: { complaints },
    });
  } catch (error) {
    console.error("Get complaints error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaints",
    });
  }
};

/**
 * @route   GET /api/complaints/:id
 * @desc    View single complaint status / details
 * @access  Private (citizen — own)
 */
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { complaint },
    });
  } catch (error) {
    console.error("Get complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaint",
    });
  }
};

/**
 * @route   PUT /api/complaints/:id
 * @desc    Update own Pending complaint
 * @access  Private (citizen)
 */
export const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only Pending complaints can be updated",
      });
    }

    const { title, description, category } = req.body;

    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;

    if (req.files?.length) {
      const newFiles = req.files.map((f) => `/uploads/${f.filename}`);
      complaint.attachments = [...complaint.attachments, ...newFiles];
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: { complaint },
    });
  } catch (error) {
    console.error("Update complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating complaint",
    });
  }
};

/**
 * @route   DELETE /api/complaints/:id
 * @desc    Soft-delete own complaint
 * @access  Private (citizen)
 */
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.isDeleted = true;
    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting complaint",
    });
  }
};
