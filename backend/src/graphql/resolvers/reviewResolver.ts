import Review from "../../models/Review";
import Course from "../../models/Course";
import Enrollment from "../../models/Enrollment";
import { GraphQLError } from "graphql";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { Context } from "../../types/context";
import { validateReviewInput } from "../../utils/validation";

export const reviewResolvers = {
  Query: {
    getReviews: async (_: any, { courseId }: { courseId: string }) => {
      return await Review.find({ courseId })
        .populate("studentId")
        .populate("courseId")
        .sort({ createdAt: -1 });
    },

    getMyReview: async (
      _: any,
      { courseId }: { courseId: string },
      context: Context
    ) => {
      requireAuth(context);

      const review = await Review.findOne({
        courseId,
        studentId: context.user!.id,
      })
        .populate("studentId")
        .populate("courseId");

      return review;
    },

    getTopRatedCourses: async (_: any, { limit = 10 }: { limit?: number }) => {
      // Aggregate to get courses with their average ratings
      const topCourses = await Review.aggregate([
        {
          $group: {
            _id: "$courseId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
        {
          $match: {
            totalReviews: { $gte: 1 }, // At least 1 review
          },
        },
        {
          $sort: { averageRating: -1 },
        },
        {
          $limit: limit,
        },
      ]);

      // Populate course details
      const courseIds = topCourses.map((c) => c._id);
      const courses = await Course.find({ _id: { $in: courseIds } }).populate(
        "instructor"
      );

      // Merge rating data with course data
      return courses.map((course) => {
        const ratingData = topCourses.find(
          (c) => c._id.toString() === course.id
        );
        return {
          ...course.toObject(),
          averageRating: ratingData?.averageRating || 0,
          totalReviews: ratingData?.totalReviews || 0,
        };
      });
    },
  },

  Mutation: {
    addReview: async (_: any, { input }: any, context: Context) => {
      requireRole(context, ["student"]);

      // Validate input
      validateReviewInput(input);

      const { courseId, rating, comment } = input;

      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if student is enrolled
      const enrollment = await Enrollment.findOne({
        courseId,
        studentId: context.user!.id,
      });

      if (!enrollment) {
        throw new GraphQLError(
          "You must be enrolled in this course to leave a review",
          {
            extensions: { code: "FORBIDDEN" },
          }
        );
      }

      // Check if review already exists
      const existingReview = await Review.findOne({
        courseId,
        studentId: context.user!.id,
      });

      if (existingReview) {
        throw new GraphQLError("You have already reviewed this course", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new GraphQLError("Rating must be between 1 and 5", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Create review
      const review = await Review.create({
        courseId,
        studentId: context.user!.id,
        rating,
        comment,
      });

      return await review.populate(["studentId", "courseId"]);
    },

    updateReview: async (_: any, { id, input }: any, context: Context) => {
      requireRole(context, ["student"]);

      const review = await Review.findById(id);

      if (!review) {
        throw new GraphQLError("Review not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if user owns the review
      if (review.studentId.toString() !== context.user!.id) {
        throw new GraphQLError("You can only update your own reviews", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      // Validate rating if provided
      if (input.rating && (input.rating < 1 || input.rating > 5)) {
        throw new GraphQLError("Rating must be between 1 and 5", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const updatedReview = await Review.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).populate(["studentId", "courseId"]);

      return updatedReview;
    },

    deleteReview: async (_: any, { id }: { id: string }, context: Context) => {
      requireRole(context, ["student"]);

      const review = await Review.findById(id);

      if (!review) {
        throw new GraphQLError("Review not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if user owns the review
      if (review.studentId.toString() !== context.user!.id) {
        throw new GraphQLError("You can only delete your own reviews", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      await Review.findByIdAndDelete(id);
      return "Review deleted successfully";
    },
  },

  Review: {
    course: async (parent: any) => {
      return await Course.findById(parent.courseId).populate("instructor");
    },
    student: async (parent: any) => {
      return parent.studentId;
    },
  },
};
