import Enrollment from "../../models/Enrollment";
import Course from "../../models/Course";
import Lesson from "../../models/Lesson";
import { GraphQLError } from "graphql";
import { requireAuth, requireRole } from "../../middlewares/auth";
import { Context } from "../../types/context";

export const enrollmentResolvers = {
  Query: {
    myCourses: async (_: any, __: any, context: Context) => {
      requireRole(context, ["student"]);

      const enrollments = await Enrollment.find({ studentId: context.user!.id })
        .populate("courseId")
        .populate("studentId")
        .populate("completedLessons")
        .sort({ enrolledAt: -1 });

      return enrollments;
    },

    isEnrolled: async (
      _: any,
      { courseId }: { courseId: string },
      context: Context
    ) => {
      requireAuth(context);

      const enrollment = await Enrollment.findOne({
        courseId,
        studentId: context.user!.id,
      });

      return !!enrollment;
    },
  },

  Mutation: {
    enrollCourse: async (
      _: any,
      { courseId }: { courseId: string },
      context: Context
    ) => {
      requireRole(context, ["student"]);

      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) {
        throw new GraphQLError("Course not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        courseId,
        studentId: context.user!.id,
      });

      if (existingEnrollment) {
        throw new GraphQLError("You are already enrolled in this course", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Create enrollment
      const enrollment = await Enrollment.create({
        courseId,
        studentId: context.user!.id,
      });

      return await enrollment.populate([
        "courseId",
        "studentId",
        "completedLessons",
      ]);
    },

    markLessonComplete: async (
      _: any,
      { lessonId }: { lessonId: string },
      context: Context
    ) => {
      requireRole(context, ["student"]);

      // Find the lesson
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        throw new GraphQLError("Lesson not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }

      // Find enrollment
      const enrollment = await Enrollment.findOne({
        courseId: lesson.courseId,
        studentId: context.user!.id,
      });

      if (!enrollment) {
        throw new GraphQLError("You are not enrolled in this course", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      // Check if already completed
      if (enrollment.completedLessons.includes(lesson._id as any)) {
        throw new GraphQLError("Lesson already completed", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Add to completed lessons
      enrollment.completedLessons.push(lesson._id as any);

      // Calculate progress
      const totalLessons = await Lesson.countDocuments({
        courseId: lesson.courseId,
      });
      enrollment.progress =
        (enrollment.completedLessons.length / totalLessons) * 100;

      // Update last accessed
      enrollment.lastAccessedAt = new Date();

      await enrollment.save();

      return await enrollment.populate([
        "courseId",
        "studentId",
        "completedLessons",
      ]);
    },
  },

  Enrollment: {
    course: async (parent: any) => {
      return await Course.findById(parent.courseId).populate("instructor");
    },
    student: async (parent: any) => {
      return parent.studentId;
    },
    completedLessons: async (parent: any) => {
      return await Lesson.find({ _id: { $in: parent.completedLessons } }).sort({
        order: 1,
      });
    },
  },
};
