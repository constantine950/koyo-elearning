import User from "../../models/User";
import { generateToken } from "../../utils/token";
import { GraphQLError } from "graphql";
import { requireAuth } from "../../middlewares/auth";
import { Context } from "../../types/context";

export const userResolvers = {
  Query: {
    hello: () => "Hello from Koyo E-Learning Platform! 🚀",

    me: async (_: any, __: any, context: Context) => {
      requireAuth(context);
      return context.user;
    },
  },

  Mutation: {
    register: async (_: any, { input }: any) => {
      const { name, email, password, role } = input;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new GraphQLError("User already exists", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // Create new user (convert role to lowercase)
      const user = await User.create({
        name,
        email,
        password,
        role: role.toLowerCase(),
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user,
      };
    },

    login: async (_: any, { input }: any) => {
      const { email, password } = input;

      // Find user with password field
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      // Check password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user,
      };
    },
  },
};
