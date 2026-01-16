import { useParams, useNavigate } from "react-router-dom";
import { GET_COURSE, GET_REVIEWS, IS_ENROLLED } from "../graphql/queries";
import { ENROLL_COURSE, ADD_REVIEW } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { useUserStore } from "../store/userStore";
import { useState } from "react";
import {
  Star,
  Users,
  Clock,
  PlayCircle,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import type { Course, Review, Lesson } from "../types";
import { useMutation, useQuery } from "@apollo/client/react";

interface GetCourseData {
  getCourse: Course;
}

interface GetReviewsData {
  getReviews: Review[];
}

interface IsEnrolledData {
  isEnrolled: boolean;
}

interface EnrollCourseData {
  enrollCourse: {
    id: string;
    enrolledAt: string;
    progress: number;
  };
}

interface AddReviewData {
  addReview: Review;
}

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  const { data: courseData, loading: courseLoading } = useQuery<GetCourseData>(
    GET_COURSE,
    {
      variables: { id },
      skip: !id,
    }
  );

  const { data: reviewsData } = useQuery<GetReviewsData>(GET_REVIEWS, {
    variables: { courseId: id },
    skip: !id,
  });

  const { data: enrolledData } = useQuery<IsEnrolledData>(IS_ENROLLED, {
    variables: { courseId: id },
    skip: !user || !id,
  });

  const [enrollCourse, { loading: enrolling }] = useMutation<EnrollCourseData>(
    ENROLL_COURSE,
    {
      onCompleted: () => {
        alert("Successfully enrolled!");
        window.location.reload();
      },
      onError: (err) => {
        alert(err.message);
      },
    }
  );

  const [addReview] = useMutation<AddReviewData>(ADD_REVIEW, {
    onCompleted: () => {
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: "" });
      alert("Review added successfully!");
      window.location.reload();
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const course = courseData?.getCourse;
  const reviews = reviewsData?.getReviews || [];
  const isEnrolled = enrolledData?.isEnrolled || false;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Course not found</p>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!id) return;

    await enrollCourse({
      variables: { courseId: id },
    });
  };

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;

    await addReview({
      variables: {
        input: {
          courseId: id,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
      },
    });
  };

  const totalDuration =
    course.lessons?.reduce((sum, lesson) => sum + lesson.duration, 0) || 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Course Header */}
      <div className="bg-linear-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  {course.level}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-primary-100 mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {course.averageRating.toFixed(1)}
                  </span>
                  <span className="text-primary-200">
                    ({course.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.totalStudents} students</span>
                </div>
              </div>

              <p className="mt-4 text-primary-100">
                Created by{" "}
                <span className="font-medium">{course.instructor.name}</span>
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-gray-900">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full aspect-video object-cover rounded-lg mb-4"
                />
              )}

              <div className="text-3xl font-bold text-primary-600 mb-4">
                ${course.price.toFixed(2)}
              </div>

              {isEnrolled ? (
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Enrolled
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Lessons */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary-600" />
                Course Content
              </h2>

              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson: Lesson, index: number) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-gray-500">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {Math.floor(lesson.duration / 60)}m
                        </div>
                        {lesson.isFree && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Free
                          </span>
                        )}
                        <PlayCircle className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No lessons available yet</p>
              )}
            </div>

            {/* Reviews */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Student Reviews</h2>
                {user && user.role === "student" && isEnrolled && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn-primary text-sm"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      className="input-field"
                      value={reviewData.rating}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          rating: parseInt(e.target.value),
                        })
                      }
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r !== 1 && "s"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      className="input-field"
                      rows={4}
                      required
                      maxLength={500}
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData({
                          ...reviewData,
                          comment: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Submit Review
                  </button>
                </form>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: Review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                            {review.student.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{review.student.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card sticky top-4">
              <h3 className="font-bold text-lg mb-4">Course Includes</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <PlayCircle className="w-5 h-5 text-primary-600" />
                  {course.lessons?.length || 0} Lessons
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-primary-600" />
                  {hours > 0 && `${hours}h `}
                  {minutes}m of content
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  Lifetime Access
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                  Certificate of Completion
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Instructor</h4>
                <p className="text-gray-700 font-medium">
                  {course.instructor.name}
                </p>
                <p className="text-sm text-gray-500">
                  {course.instructor.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
