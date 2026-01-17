import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_INSTRUCTOR_COURSES } from "../graphql/queries";
import { DELETE_COURSE } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { Plus, BookOpen, Users, Star, Edit, Trash2 } from "lucide-react";
import { type Course } from "../types";

interface GetInstructorCoursesData {
  getInstructorCourses: Course[];
}

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery<GetInstructorCoursesData>(
    GET_INSTRUCTOR_COURSES
  );

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    onCompleted: () => {
      alert("Course deleted successfully!");
      refetch();
    },
    onError: (err) => {
      alert(`Error: ${err.message}`);
    },
  });

  const courses = data?.getInstructorCourses || [];

  const handleDelete = async (courseId: string, courseTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`
    );

    if (confirmed) {
      await deleteCourse({
        variables: { id: courseId },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-24 bg-gray-300"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-gray-600">Manage your courses and content</p>
          </div>

          <button
            onClick={() => navigate("/instructor/courses/create")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold">
                  {courses.reduce((sum, c) => sum + c.totalStudents, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Average Rating</p>
                <p className="text-2xl font-bold">
                  {courses.length > 0
                    ? (
                        courses.reduce((sum, c) => sum + c.averageRating, 0) /
                        courses.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses List */}
        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first course to get started
            </p>
            <button
              onClick={() => navigate("/instructor/courses/create")}
              className="btn-primary"
            >
              Create Course
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="card">
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/instructor/courses/${course.id}/edit`)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit course"
                        >
                          <Edit className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id, course.title)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete course"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {course.totalStudents} students
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.averageRating.toFixed(1)} ({course.totalReviews}{" "}
                        reviews)
                      </div>

                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm capitalize">
                        {course.level}
                      </span>

                      <span className="text-lg font-bold text-primary-600">
                        ${course.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
