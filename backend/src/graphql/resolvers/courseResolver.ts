import Course from "../../models/Course";
import Lesson from "../../models/Lesson";
import Enrollment from "../../models/Enrollment";
import Review from "../../models/Review";
import { GraphQLError } from "graphql";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { Context } from "../../types/context";

export const courseResolvers = {
  Query: {
    getCourses: async () => {
      return await Course.find().populate("instructor").sort({ createdAt: -1 });
    },

    getCourse: async (_: any, { id }: { id: string }) => {
      const course = await Course.findById(id).populate("instructor");

      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return course;
    },
  },

  Mutation: {
    createCourse: async (_: any, { input }: any, context: Context) => {
      requireRole(context, ["instructor"]);

      const course = await Course.create({
        ...input,
        level: input.level.toLowerCase(),
        instructor: context.user!.id,
      });

      return await course.populate("instructor");
    },

    updateCourse: async (_: any, { id, input }: any, context: Context) => {
      requireRole(context, ["instructor"]);

      const course = await Course.findById(id);

      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (course.instructor.toString() !== context.user!.id) {
        throw new GraphQLError("You can only update your own courses", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      if (input.level) {
        input.level = input.level.toLowerCase();
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).populate("instructor");

      return updatedCourse;
    },

    deleteCourse: async (_: any, { id }: { id: string }, context: Context) => {
      requireRole(context, ["instructor"]);

      const course = await Course.findById(id);

      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      if (course.instructor.toString() !== context.user!.id) {
        throw new GraphQLError("You can only delete your own courses", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      // Delete all lessons associated with the course
      await Lesson.deleteMany({ courseId: id });

      // Delete all enrollments
      await Enrollment.deleteMany({ courseId: id });

      // Delete all reviews
      await Review.deleteMany({ courseId: id });

      await Course.findByIdAndDelete(id);
      return "Course deleted successfully";
    },
  },

  Course: {
    level: (parent: any) => parent.level.toUpperCase(),
    lessons: async (parent: any) => {
      return await Lesson.find({ courseId: parent.id }).sort({ order: 1 });
    },
    totalStudents: async (parent: any) => {
      return await Enrollment.countDocuments({ courseId: parent.id });
    },
    averageRating: async (parent: any) => {
      const result = await Review.aggregate([
        { $match: { courseId: parent._id } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);

      return result.length > 0 ? result[0].averageRating : 0;
    },
    totalReviews: async (parent: any) => {
      return await Review.countDocuments({ courseId: parent.id });
    },
  },
};
