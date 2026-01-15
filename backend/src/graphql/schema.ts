import { typeDefs } from "./typeDefs";
import { userResolvers } from "./resolvers/userResolver";
import { courseResolvers } from "./resolvers/courseResolver";
import { lessonResolvers } from "./resolvers/lessonResolver";
import { enrollmentResolvers } from "./resolvers/enrollmentResolver";
import { uploadResolvers } from "./resolvers/uploadResolver";
import { reviewResolvers } from "./resolvers/reviewResolver";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...courseResolvers.Query,
    ...lessonResolvers.Query,
    ...enrollmentResolvers.Query,
    ...reviewResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...lessonResolvers.Mutation,
    ...enrollmentResolvers.Mutation,
    ...uploadResolvers.Mutation,
    ...reviewResolvers.Mutation,
  },
  User: {
    role: (parent: any) => parent.role.toUpperCase(),
  },
  Course: {
    ...courseResolvers.Course,
  },
  Enrollment: {
    ...enrollmentResolvers.Enrollment,
  },
  Review: {
    ...reviewResolvers.Review,
  },
};

export { typeDefs };
