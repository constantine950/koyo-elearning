import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const ENROLL_COURSE = gql`
  mutation EnrollCourse($courseId: ID!) {
    enrollCourse(courseId: $courseId) {
      id
      enrolledAt
      progress
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($input: AddReviewInput!) {
    addReview(input: $input) {
      id
      rating
      comment
      createdAt
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      thumbnail
      category
      price
      level
    }
  }
`;

export const UPLOAD_IMAGE = gql`
  mutation UploadImage($file: String!, $folder: String!) {
    uploadImage(file: $file, folder: $folder) {
      url
      publicId
      format
    }
  }
`;

export const MARK_LESSON_COMPLETE = gql`
  mutation MarkLessonComplete($lessonId: ID!) {
    markLessonComplete(lessonId: $lessonId) {
      id
      progress
      completedLessons {
        id
        title
      }
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      description
      thumbnail
      category
      price
      level
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;
