import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum UserRole {
    STUDENT
    INSTRUCTOR
  }

  enum CourseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    avatar: String
    createdAt: String!
    updatedAt: String!
  }

  type Lesson {
    id: ID!
    title: String!
    description: String
    videoURL: String!
    duration: Int!
    order: Int!
    courseId: ID!
    isFree: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Review {
    id: ID!
    course: Course!
    student: User!
    rating: Int!
    comment: String!
    createdAt: String!
    updatedAt: String!
  }

  type CourseWithRating {
    id: ID!
    title: String!
    description: String!
    thumbnail: String
    category: String!
    instructor: User!
    price: Float!
    level: CourseLevel!
    lessons: [Lesson!]
    totalStudents: Int!
    averageRating: Float!
    totalReviews: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    thumbnail: String
    category: String!
    instructor: User!
    price: Float!
    level: CourseLevel!
    lessons: [Lesson!]
    totalStudents: Int!
    averageRating: Float!
    totalReviews: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Enrollment {
    id: ID!
    course: Course!
    student: User!
    enrolledAt: String!
    progress: Float!
    completedLessons: [Lesson!]!
    lastAccessedAt: String!
  }

  type UploadResponse {
    url: String!
    publicId: String!
    format: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: UserRole!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateCourseInput {
    title: String!
    description: String!
    thumbnail: String
    category: String!
    price: Float!
    level: CourseLevel!
  }

  input UpdateCourseInput {
    title: String
    description: String
    thumbnail: String
    category: String
    price: Float
    level: CourseLevel
  }

  input CreateLessonInput {
    title: String!
    description: String
    videoURL: String!
    duration: Int!
    order: Int!
    courseId: ID!
    isFree: Boolean
  }

  input UpdateLessonInput {
    title: String
    description: String
    videoURL: String
    duration: Int
    order: Int
    isFree: Boolean
  }

  input AddReviewInput {
    courseId: ID!
    rating: Int!
    comment: String!
  }

  input UpdateReviewInput {
    rating: Int
    comment: String
  }

  type Query {
    hello: String
    me: User
    getCourses: [Course!]!
    getCourse(id: ID!): Course
    getLessons(courseId: ID!): [Lesson!]!
    getLesson(id: ID!): Lesson
    myCourses: [Enrollment!]!
    isEnrolled(courseId: ID!): Boolean!
    getReviews(courseId: ID!): [Review!]!
    getMyReview(courseId: ID!): Review
    getTopRatedCourses(limit: Int): [Course!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createCourse(input: CreateCourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    deleteCourse(id: ID!): String!
    createLesson(input: CreateLessonInput!): Lesson!
    updateLesson(id: ID!, input: UpdateLessonInput!): Lesson!
    deleteLesson(id: ID!): String!
    enrollCourse(courseId: ID!): Enrollment!
    markLessonComplete(lessonId: ID!): Enrollment!
    uploadImage(file: String!, folder: String!): UploadResponse!
    uploadVideo(file: String!, folder: String!): UploadResponse!
    addReview(input: AddReviewInput!): Review!
    updateReview(id: ID!, input: UpdateReviewInput!): Review!
    deleteReview(id: ID!): String!
  }
`;
