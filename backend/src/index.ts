import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/schema";
import { connectDB } from "./config/db";

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
    context: ({ req }) => ({ req }),
  });

  await server.start();

  // Use type assertion to fix the compatibility issue
  server.applyMiddleware({
    app: app as any,
    path: "/graphql",
  });

  return app;
};
