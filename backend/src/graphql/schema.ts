import { typeDefs } from "./typeDefs";
import { userResolvers } from "./resolvers/userResolver";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
  User: {
    // Transform lowercase role from DB to uppercase for GraphQL
    role: (parent: any) => parent.role.toUpperCase(),
  },
};

export { typeDefs };
