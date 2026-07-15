import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

/**
 * Parse details if sent as JSON string (multipart form-data).
 */
const parseDetails = (details) => {
  if (typeof details === "string") {
    try {
      return JSON.parse(details);
    } catch {
      return null;
    }
  }
  return details;
};

/**
 * @route   POST /api/services/applications
 * @desc    Submit a new citizen service application
 * @access  Private (citizen)
 */
export const submitApplication = async (req, res) => {
  try {
    const details = parseDetails(req.body.details);

    if (!details || typeof details !== "object" || Array.isArray(details)) {
      return res.status(400).json({
        success: false,
        message: "Details must be a valid object",
      });
    }

    const trackingId = await Application.generateTrackingId();

    const attachments = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const application = await Application.create({
      citizenId: req.user._id,
      applicationType: req.body.applicationType,
      trackingId,
      details,
      attachments,
      status: "Pending",
    });

    await Notification.create({
      citizenId: req.user._id,
      title: "Application Submitted",
      message: `Your ${req.body.applicationType} application (${trackingId}) has been submitted and is pending review.`,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: { application },
    });
  } catch (error) {
    console.error("Submit application error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting application",
    });
  }
};

/**
 * @route   POST /api/services/applications/draft
 * @desc    Save application as draft (Pending, editable)
 * @access  Private (citizen)
 */
export const saveApplication = async (req, res) => {
  try {
    const details = parseDetails(req.body.details) || {};

    const trackingId = await Application.generateTrackingId();

    const attachments = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const application = await Application.create({
      citizenId: req.user._id,
      applicationType: req.body.applicationType,
      trackingId,
      details,
      attachments,
      status: "Pending",
      remarks: "Draft / saved for later",
    });

    return res.status(201).json({
      success: true,
      message: "Application saved successfully",
      data: { application },
    });
  } catch (error) {
    console.error("Save application error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving application",
    });
  }
};

/**
 * @route   PUT /api/services/applications/:id
 * @desc    Edit own Pending application
 * @access  Private (citizen)
 */
export const editApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only Pending applications can be edited",
      });
    }

    if (req.body.details !== undefined) {
      const details = parseDetails(req.body.details);
      if (!details || typeof details !== "object" || Array.isArray(details)) {
        return res.status(400).json({
          success: false,
          message: "Details must be a valid object",
        });
      }
      application.details = details;
    }

    if (req.body.applicationType) {
      application.applicationType = req.body.applicationType;
    }

    if (req.files?.length) {
      const newFiles = req.files.map((f) => `/uploads/${f.filename}`);
      application.attachments = [...application.attachments, ...newFiles];
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: { application },
    });
  } catch (error) {
    console.error("Edit application error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating application",
    });
  }
};

/**
 * @route   DELETE /api/services/applications/:id
 * @desc    Soft-delete own application
 * @access  Private (citizen)
 */
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Approved applications cannot be deleted",
      });
    }

    application.isDeleted = true;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting application",
    });
  }
};

/**
 * @route   GET /api/services/track/:trackingId
 * @desc    Track application by tracking ID (WARD-YYYY-XXXXX)
 * @access  Private (citizen — own applications)
 */
export const trackByApplicationId = async (req, res) => {
  try {
    const application = await Application.findOne({
      trackingId: req.params.trackingId.toUpperCase(),
      isDeleted: false,
    }).populate("citizenId", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Citizens can only track their own; staff can track any (Member 2 scope)
    if (
      req.user.role === "citizen" &&
      application.citizenId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only track your own applications",
      });
    }

    return res.status(200).json({
      success: true,
      data: { application },
    });
  } catch (error) {
    console.error("Track by application ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while tracking application",
    });
  }
};

/**
 * @route   GET /api/services/my-applications
 * @desc    List logged-in citizen's applications (optional ?status=)
 * @access  Private (citizen)
 */
export const trackByCitizenId = async (req, res) => {
  try {
    const filter = {
      citizenId: req.user._id,
      isDeleted: false,
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.applicationType) {
      filter.applicationType = req.query.applicationType;
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: { applications },
    });
  } catch (error) {
    console.error("Track by citizen ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
    });
  }
};

/**
 * @route   GET /api/services/applications/:id
 * @desc    Get single application by MongoDB _id
 * @access  Private (citizen — own)
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
      isDeleted: false,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { application },
    });
  } catch (error) {
    console.error("Get application error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching application",
    });
  }
};
