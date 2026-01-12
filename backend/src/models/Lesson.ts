import mongoose, { Schema } from "mongoose";
import { ILesson } from "../types/lesson";

const LessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    videoURL: {
      type: String,
      required: [true, "Video URL is required"],
    },
    duration: {
      type: Number,
      default: 0, // in seconds
    },
    order: {
      type: Number,
      required: [true, "Lesson order is required"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    } as any,
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient ordering
LessonSchema.index({ courseId: 1, order: 1 });

export default mongoose.model<ILesson>("Lesson", LessonSchema);
