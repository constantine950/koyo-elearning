import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/schema";
import { connectDB } from "./config/db";
import { authenticate } from "./middlewares/auth";

export const startServer = async () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  await connectDB();

  // Apollo Server Setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await authenticate(req);
      return { req, user };
    },
    formatError: (error) => {
      // Log error for debugging
      console.error("GraphQL Error:", error);

      // Return formatted error
      return {
        message: error.message,
        code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
        path: error.path,
      };
    },
  });

  await server.start();

  server.applyMiddleware({
    app: app as any,
    path: "/graphql",
  });

  return app;
};
