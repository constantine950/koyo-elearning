import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  instructor: Types.ObjectId;
  price: number;
  level: CourseLevel;
  lessons?: Types.ObjectId[]; // Add lessons array
  createdAt: Date;
  updatedAt: Date;
}

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}
