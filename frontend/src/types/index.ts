export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoURL: string;
  duration: number;
  order: number;
  isFree: boolean;
  courseId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  category: string;
  price: number;
  level: string;
  averageRating: number;
  totalStudents: number;
  totalReviews: number;
  instructor: Instructor;
  lessons?: Lesson[];
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface Enrollment {
  id: string;
  enrolledAt: string;
  progress: number;
  course: Course;
}

export interface ReviewInput {
  courseId: string;
  rating: number;
  comment: string;
}
