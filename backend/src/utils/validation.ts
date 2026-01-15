import { ValidationError } from "../middlewares/error";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): void => {
  if (password.length < 6) {
    throw new ValidationError("Password must be at least 6 characters long");
  }
};

export const validateRating = (rating: number): void => {
  if (rating < 1 || rating > 5) {
    throw new ValidationError("Rating must be between 1 and 5");
  }
};

export const validatePrice = (price: number): void => {
  if (price < 0) {
    throw new ValidationError("Price cannot be negative");
  }
};

export const validateCourseInput = (input: any): void => {
  if (!input.title || input.title.trim().length === 0) {
    throw new ValidationError("Course title is required");
  }

  if (input.title.length > 100) {
    throw new ValidationError("Course title must be less than 100 characters");
  }

  if (!input.description || input.description.trim().length === 0) {
    throw new ValidationError("Course description is required");
  }

  if (!input.category || input.category.trim().length === 0) {
    throw new ValidationError("Course category is required");
  }

  validatePrice(input.price);
};

export const validateLessonInput = (input: any): void => {
  if (!input.title || input.title.trim().length === 0) {
    throw new ValidationError("Lesson title is required");
  }

  if (!input.videoURL || input.videoURL.trim().length === 0) {
    throw new ValidationError("Video URL is required");
  }

  if (input.order < 1) {
    throw new ValidationError("Lesson order must be at least 1");
  }

  if (input.duration < 0) {
    throw new ValidationError("Lesson duration cannot be negative");
  }
};

export const validateReviewInput = (input: any): void => {
  validateRating(input.rating);

  if (!input.comment || input.comment.trim().length === 0) {
    throw new ValidationError("Review comment is required");
  }

  if (input.comment.length > 500) {
    throw new ValidationError(
      "Review comment must be less than 500 characters"
    );
  }
};
