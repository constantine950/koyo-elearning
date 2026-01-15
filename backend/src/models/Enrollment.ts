import mongoose, { Schema } from "mongoose";

export interface IEnrollment extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  progress: number; // percentage 0-100
  completedLessons: mongoose.Types.ObjectId[];
  lastAccessedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    } as any,
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    } as any,
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
