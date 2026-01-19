import { useQuery } from "@apollo/client/react";
import { MY_COURSES } from "../graphql/queries";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle } from "lucide-react";
import { type Enrollment } from "../types";
import { formatDate } from "../utils/formatDate";

interface MyCoursesData {
  myCourses: Enrollment[];
}

const MyCourses = () => {
  const { data, loading, error } = useQuery<MyCoursesData>(MY_COURSES);

  const enrollments = data?.myCourses || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card bg-red-50 border border-red-200 text-red-700">
            Error loading courses: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>

        {enrollments.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">
              Start learning by enrolling in a course
            </p>
            <Link to="/" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/courses/${enrollment.course.id}`}
                className="card hover:shadow-xl transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  by {enrollment.course.instructor.name}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-primary-600">
                      {Math.round(enrollment.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    Enrolled {formatDate(enrollment.enrolledAt)}
                  </span>
                  <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                    <PlayCircle className="w-4 h-4" />
                    Continue
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
