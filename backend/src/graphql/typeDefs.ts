import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum UserRole {
    STUDENT
    INSTRUCTOR
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

  type Query {
    hello: String
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
  }
`;
