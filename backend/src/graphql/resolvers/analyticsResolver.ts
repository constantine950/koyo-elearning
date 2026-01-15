import Course from "../../models/Course";
import Enrollment from "../../models/Enrollment";
import Review from "../../models/Review";
import { requireRole } from "../../middlewares/auth";
import { Context } from "../../types/context";

export const analyticsResolvers = {
  Query: {
    getInstructorAnalytics: async (_: any, __: any, context: Context) => {
      requireRole(context, ["instructor"]);

      const instructorId = context.user!.id;

      // Get all courses by instructor
      const courses = await Course.find({ instructor: instructorId });
      const courseIds = courses.map((c) => c._id);

      // Total students (unique enrollments)
      const totalStudents = await Enrollment.countDocuments({
        courseId: { $in: courseIds },
      });

      // Total courses
      const totalCourses = courses.length;

      // Total revenue
      const enrollments = await Enrollment.find({
        courseId: { $in: courseIds },
      }).populate("courseId");

      const totalRevenue = enrollments.reduce((sum, enrollment: any) => {
        return sum + (enrollment.courseId?.price || 0);
      }, 0);

      // Monthly enrollments (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyEnrollments = await Enrollment.aggregate([
        {
          $match: {
            courseId: { $in: courseIds },
            enrolledAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$enrolledAt" },
              month: { $month: "$enrolledAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      const formattedMonthlyEnrollments = monthlyEnrollments.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
        count: item.count,
      }));

      // Top 5 courses by enrollment
      const topCoursesData = await Enrollment.aggregate([
        {
          $match: { courseId: { $in: courseIds } },
        },
        {
          $group: {
            _id: "$courseId",
            enrollmentCount: { $sum: 1 },
          },
        },
        {
          $sort: { enrollmentCount: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      const topCourses = await Promise.all(
        topCoursesData.map(async (item) => {
          const course = await Course.findById(item._id).populate("instructor");
          const revenue = item.enrollmentCount * (course?.price || 0);
          return {
            course,
            enrollmentCount: item.enrollmentCount,
            revenue,
          };
        })
      );

      // Average rating across all courses
      const reviewsData = await Review.aggregate([
        {
          $match: { courseId: { $in: courseIds } },
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      const averageRating =
        reviewsData.length > 0 ? reviewsData[0].averageRating : 0;
      const totalReviews =
        reviewsData.length > 0 ? reviewsData[0].totalReviews : 0;

      return {
        totalStudents,
        totalCourses,
        totalRevenue,
        monthlyEnrollments: formattedMonthlyEnrollments,
        topCourses,
        averageRating,
        totalReviews,
      };
    },

    getInstructorCourses: async (_: any, __: any, context: Context) => {
      requireRole(context, ["instructor"]);

      return await Course.find({ instructor: context.user!.id })
        .populate("instructor")
        .sort({ createdAt: -1 });
    },
  },
};
