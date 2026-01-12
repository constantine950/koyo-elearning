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
    createdAt: String!
    updatedAt: String!
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

  type Query {
    hello: String
    me: User
    getCourses: [Course!]!
    getCourse(id: ID!): Course
    getLessons(courseId: ID!): [Lesson!]!
    getLesson(id: ID!): Lesson
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
  }
`;
