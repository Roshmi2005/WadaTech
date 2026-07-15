import User from "../models/User.js";

/**
 * @route   GET /api/citizen/profile
 * @desc    View logged-in user profile
 * @access  Private
 */
export const viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("View profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

/**
 * @route   PUT /api/citizen/profile
 * @desc    Edit profile (name, email)
 * @access  Private
 */
export const editProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

/**
 * @route   PUT /api/citizen/change-password
 * @desc    Change password (requires old password)
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};

/**
 * @route   PUT /api/citizen/profile-picture
 * @desc    Upload / update profile picture via Multer
 * @access  Private
 */
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Use field name 'profilePicture'.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Store relative path for serving via /uploads static route
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        profilePicture: user.profilePicture,
        user,
      },
    });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading profile picture",
    });
  }
};
