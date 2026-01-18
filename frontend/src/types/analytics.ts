export interface MonthlyEnrollment {
  month: string;
  count: number;
}

export interface TopCourse {
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  enrollmentCount: number;
  revenue: number;
}

export interface InstructorAnalytics {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  monthlyEnrollments: MonthlyEnrollment[];
  topCourses: TopCourse[];
}
