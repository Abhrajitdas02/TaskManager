import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },
    category: {
      type: String,
      default: "general",
    },
    notificationSettings: {
      enabled: {
        type: Boolean,
        default: true,
      },
      reminderTimes: [
        {
          minutes: {
            type: Number,
            required: true,
          },
          enabled: {
            type: Boolean,
            default: true,
          },
        },
      ],
      priorityLevels: {
        high: {
          type: Boolean,
          default: true,
        },
        medium: {
          type: Boolean,
          default: true,
        },
        low: {
          type: Boolean,
          default: false,
        },
      },
      channels: {
        browser: {
          type: Boolean,
          default: true,
        },
        email: {
          type: Boolean,
          default: false,
        },
      },
      notifiedTimes: [
        {
          type: Date,
        },
      ],
    },
    lastNotified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add middleware to check and update task status
taskSchema.pre("save", function (next) {
  const now = new Date();
  if (this.dueDate < now && this.status === "pending") {
    this.status = "overdue";
  }
  next();
});

export default mongoose.model("Task", taskSchema);
