import Lesson from "../../models/Lesson";
import Course from "../../models/Course";
import { GraphQLError } from "graphql";
import { requireRole } from "../../middlewares/auth";
import { Context } from "../../types/context";
import { validateLessonInput } from "../../utils/validation";
import { ForbiddenError, NotFoundError } from "../../middlewares/error";

export const lessonResolvers = {
  Query: {
    getLessons: async (_: any, { courseId }: { courseId: string }) => {
      return await Lesson.find({ courseId }).sort({ order: 1 });
    },

    getLesson: async (_: any, { id }: { id: string }) => {
      const lesson = await Lesson.findById(id);

      if (!lesson) {
        throw new GraphQLError("Lesson not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      return lesson;
    },
  },

  Mutation: {
    createLesson: async (_: any, { input }: any, context: Context) => {
      requireRole(context, ["instructor"]);

      // Validate input
      validateLessonInput(input);

      // Check if course exists and belongs to the instructor
      const course = await Course.findById(input.courseId);

      if (!course) {
        throw new NotFoundError("Course");
      }

      if (course.instructor.toString() !== context.user!.id) {
        throw new ForbiddenError(
          "You can only add lessons to your own courses"
        );
      }

      const lesson = await Lesson.create(input);
      return lesson;
    },

    updateLesson: async (_: any, { id, input }: any, context: Context) => {
      requireRole(context, ["instructor"]);

      const lesson = await Lesson.findById(id);

      if (!lesson) {
        throw new GraphQLError("Lesson not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if the course belongs to the instructor
      const course = await Course.findById(lesson.courseId);

      if (!course || course.instructor.toString() !== context.user!.id) {
        throw new GraphQLError(
          "You can only update lessons from your own courses",
          {
            extensions: { code: "FORBIDDEN" },
          }
        );
      }

      const updatedLesson = await Lesson.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      );

      return updatedLesson;
    },

    deleteLesson: async (_: any, { id }: { id: string }, context: Context) => {
      requireRole(context, ["instructor"]);

      const lesson = await Lesson.findById(id);

      if (!lesson) {
        throw new GraphQLError("Lesson not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if the course belongs to the instructor
      const course = await Course.findById(lesson.courseId);

      if (!course || course.instructor.toString() !== context.user!.id) {
        throw new GraphQLError(
          "You can only delete lessons from your own courses",
          {
            extensions: { code: "FORBIDDEN" },
          }
        );
      }

      await Lesson.findByIdAndDelete(id);
      return "Lesson deleted successfully";
    },
  },
};
