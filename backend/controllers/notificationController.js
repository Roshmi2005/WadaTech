import Notification from "../models/Notification.js";

/**
 * @route   GET /api/notifications
 * @desc    Fetch all notifications for logged-in user
 * @access  Private
 */
export const viewNotifications = async (req, res) => {
  try {
    const filter = { citizenId: req.user._id };

    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === "true";
    }

    const notifications = await Notification.find(filter).sort({
      createdAt: -1,
    });

    const unreadCount = await Notification.countDocuments({
      citizenId: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: { notifications },
    });
  } catch (error) {
    console.error("View notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
    });
  }
};

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a specific notification as read
 * @access  Private
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      citizenId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: { notification },
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating notification",
    });
  }
};

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read for logged-in user
 * @access  Private
 */
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { citizenId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating notifications",
    });
  }
};
