import mongoose from "mongoose";

const APPLICATION_TYPES = [
  "Birth Certificate",
  "Death Certificate",
  "Marriage Certificate",
  "Migration Certificate",
  "Recommendation Letter",
  "Character Certificate",
];

const APPLICATION_STATUS = ["Pending", "Approved", "Rejected"];

const applicationSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Citizen ID is required"],
      index: true,
    },
    applicationType: {
      type: String,
      enum: {
        values: APPLICATION_TYPES,
        message: `Application type must be one of: ${APPLICATION_TYPES.join(", ")}`,
      },
      required: [true, "Application type is required"],
    },
    trackingId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      default: "Pending",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    attachments: {
      type: [String],
      default: [],
    },
    remarks: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ citizenId: 1, status: 1 });
applicationSchema.index({ applicationType: 1, status: 1 });

/**
 * Generate tracking ID in format: WARD-YYYY-XXXXX
 */
applicationSchema.statics.generateTrackingId = async function () {
  const year = new Date().getFullYear();
  const prefix = `WARD-${year}-`;

  const latest = await this.findOne({
    trackingId: new RegExp(`^${prefix}`),
  })
    .sort({ trackingId: -1 })
    .select("trackingId")
    .lean();

  let nextNum = 1;
  if (latest?.trackingId) {
    const parts = latest.trackingId.split("-");
    const lastNum = parseInt(parts[2], 10);
    if (!Number.isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }

  return `${prefix}${String(nextNum).padStart(5, "0")}`;
};

const Application = mongoose.model("Application", applicationSchema);

export { APPLICATION_TYPES, APPLICATION_STATUS };
export default Application;
