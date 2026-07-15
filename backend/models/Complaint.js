import mongoose from "mongoose";

const COMPLAINT_STATUS = ["Pending", "In-Progress", "Resolved"];

const COMPLAINT_CATEGORIES = [
  "Infrastructure",
  "Sanitation",
  "Water Supply",
  "Electricity",
  "Public Safety",
  "Administrative",
  "Other",
];

const complaintSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Citizen ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      enum: {
        values: COMPLAINT_CATEGORIES,
        message: `Category must be one of: ${COMPLAINT_CATEGORIES.join(", ")}`,
      },
      required: [true, "Category is required"],
    },
    status: {
      type: String,
      enum: COMPLAINT_STATUS,
      default: "Pending",
    },
    attachments: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ citizenId: 1, status: 1 });

const Complaint = mongoose.model("Complaint", complaintSchema);

export { COMPLAINT_STATUS, COMPLAINT_CATEGORIES };
export default Complaint;
