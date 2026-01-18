import { gql } from "@apollo/client";

export const GET_COURSES = gql`
  query GetCourses {
    getCourses {
      id
      title
      description
      thumbnail
      category
      price
      level
      averageRating
      totalStudents
      totalReviews
      instructor {
        id
        name
      }
      createdAt
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    getCourse(id: $id) {
      id
      title
      description
      thumbnail
      category
      price
      level
      averageRating
      totalStudents
      totalReviews
      instructor {
        id
        name
        email
      }
      lessons {
        id
        title
        description
        duration
        order
        isFree
      }
      createdAt
    }
  }
`;

export const GET_REVIEWS = gql`
  query GetReviews($courseId: ID!) {
    getReviews(courseId: $courseId) {
      id
      rating
      comment
      createdAt
      student {
        id
        name
        avatar
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
      avatar
    }
  }
`;

export const MY_COURSES = gql`
  query MyCourses {
    myCourses {
      id
      enrolledAt
      progress
      course {
        id
        title
        description
        thumbnail
        instructor {
          name
        }
      }
    }
  }
`;

export const IS_ENROLLED = gql`
  query IsEnrolled($courseId: ID!) {
    isEnrolled(courseId: $courseId)
  }
`;

export const GET_LESSON = gql`
  query GetLesson($id: ID!) {
    getLesson(id: $id) {
      id
      title
      description
      videoURL
      duration
      order
      courseId
      isFree
    }
  }
`;

export const GET_LESSONS = gql`
  query GetLessons($courseId: ID!) {
    getLessons(courseId: $courseId) {
      id
      title
      description
      videoURL
      duration
      order
      isFree
    }
  }
`;

export const GET_INSTRUCTOR_COURSES = gql`
  query GetInstructorCourses {
    getInstructorCourses {
      id
      title
      description
      thumbnail
      category
      price
      level
      totalStudents
      averageRating
      totalReviews
      createdAt
    }
  }
`;

export const GET_INSTRUCTOR_ANALYTICS = gql`
  query GetInstructorAnalytics {
    getInstructorAnalytics {
      totalStudents
      totalCourses
      totalRevenue
      averageRating
      totalReviews
      monthlyEnrollments {
        month
        count
      }
      topCourses {
        course {
          id
          title
          thumbnail
        }
        enrollmentCount
        revenue
      }
    }
  }
`;
