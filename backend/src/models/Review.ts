import mongoose, { Schema } from "mongoose";

export interface IReview extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews
ReviewSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
