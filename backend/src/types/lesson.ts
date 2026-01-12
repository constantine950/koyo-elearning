import { Document, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  description: string;
  videoURL: string;
  duration: number; // in seconds
  order: number;
  courseId: Types.ObjectId;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}
