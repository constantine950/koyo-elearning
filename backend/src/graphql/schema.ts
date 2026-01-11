import { typeDefs } from "./typeDefs";
import { userResolvers } from "./resolvers/userResolver";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};

export { typeDefs };
