import { GraphQLError } from "graphql";

export class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: "VALIDATION_ERROR",
      },
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "Not authenticated") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string = "Access denied") {
    super(message, {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string) {
    super(`${resource} not found`, {
      extensions: {
        code: "NOT_FOUND",
      },
    });
  }
}

export class DuplicateError extends GraphQLError {
  constructor(resource: string) {
    super(`${resource} already exists`, {
      extensions: {
        code: "DUPLICATE",
      },
    });
  }
}
