import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema({
  infoTask: {
    type: String,
    required: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
    require: true,
  },
});

const taskSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    checklist: [checklistSchema],
    deadline: {
      type: Date,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
