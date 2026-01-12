import { GraphQLError } from "graphql";
import { verifyToken } from "../utils/token";
import User from "../models/User";
import { Context } from "../types/context";

export const authenticate = async (req: any): Promise<any> => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (context: Context) => {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
};

export const requireRole = (context: Context, allowedRoles: string[]) => {
  requireAuth(context);

  if (!allowedRoles.includes(context.user!.role)) {
    throw new GraphQLError(
      "You do not have permission to perform this action",
      {
        extensions: { code: "FORBIDDEN" },
      }
    );
  }
};
