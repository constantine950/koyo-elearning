import { typeDefs } from "./typeDefs";
import { userResolvers } from "./resolvers/userResolver";
import { courseResolvers } from "./resolvers/courseResolver";
import { lessonResolvers } from "./resolvers/lessonResolver";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...courseResolvers.Query,
    ...lessonResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...courseResolvers.Mutation,
    ...lessonResolvers.Mutation,
  },
  User: {
    role: (parent: any) => parent.role.toUpperCase(),
  },
  Course: {
    ...courseResolvers.Course,
  },
};

export { typeDefs };
