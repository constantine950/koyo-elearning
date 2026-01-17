import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_COURSE, GET_LESSON, IS_ENROLLED } from "../graphql/queries";
import { MARK_LESSON_COMPLETE } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { VideoPlayer } from "../components/VideoPlayer";
import { useUserStore } from "../store/userStore";
import { useState } from "react";
import {
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Lock,
  Clock,
} from "lucide-react";
import type { Course, Lesson } from "../types";

interface GetCourseData {
  getCourse: Course;
}

interface GetLessonData {
  getLesson: Lesson;
}

interface IsEnrolledData {
  isEnrolled: boolean;
}

const LessonPlayer = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [completed, setCompleted] = useState(false);

  const { data: courseData, loading: courseLoading } = useQuery<GetCourseData>(
    GET_COURSE,
    {
      variables: { id: courseId },
      skip: !courseId,
    }
  );

  const { data: lessonData, loading: lessonLoading } = useQuery<GetLessonData>(
    GET_LESSON,
    {
      variables: { id: lessonId },
      skip: !lessonId,
    }
  );

  const { data: enrolledData } = useQuery<IsEnrolledData>(IS_ENROLLED, {
    variables: { courseId },
    skip: !user || !courseId,
  });

  const [markComplete] = useMutation(MARK_LESSON_COMPLETE, {
    onCompleted: () => {
      setCompleted(true);
      alert("Lesson marked as complete!");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  if (courseLoading || lessonLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const course = courseData?.getCourse;
  const lesson = lessonData?.getLesson;
  const isEnrolled = enrolledData?.isEnrolled || false;

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card text-center">
            <p className="text-gray-500">Lesson not found</p>
            <button onClick={() => navigate("/")} className="btn-primary mt-4">
              Go to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user can access this lesson
  if (!isEnrolled && !lesson.isFree) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card text-center max-w-md mx-auto">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">This lesson is locked</h2>
            <p className="text-gray-600 mb-4">
              Enroll in the course to access this lesson
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="btn-primary"
            >
              Go to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleVideoEnd = async () => {
    if (!completed && lessonId && isEnrolled) {
      await markComplete({
        variables: { lessonId },
      });
    }
  };

  const handleMarkComplete = async () => {
    if (lessonId && isEnrolled) {
      await markComplete({
        variables: { lessonId },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back to Course */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Course
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer videoURL={lesson.videoURL} onEnded={handleVideoEnd} />

            <div className="card mt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{lesson.title}</h1>
                    {lesson.isFree && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Free Preview
                      </span>
                    )}
                  </div>
                  {lesson.description && (
                    <p className="text-gray-600">{lesson.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4" />
                    {Math.floor(lesson.duration / 60)} minutes
                  </div>
                </div>

                {isEnrolled && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={completed}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      completed
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                    }`}
                  >
                    {completed ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5" />
                        Mark Complete
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                {prevLesson ? (
                  <button
                    onClick={() =>
                      navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)
                    }
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="font-medium">{prevLesson.title}</p>
                    </div>
                  </button>
                ) : (
                  <div></div>
                )}

                {nextLesson ? (
                  <button
                    onClick={() =>
                      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
                    }
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Next</p>
                      <p className="font-medium">{nextLesson.title}</p>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Lesson List */}
          <div>
            <div className="card sticky top-4">
              <h3 className="font-bold text-lg mb-4">Course Content</h3>
              <div className="space-y-2 max-h-150 overflow-y-auto">
                {lessons.map((l, index) => {
                  const canAccess = isEnrolled || l.isFree;
                  const isCurrent = l.id === lessonId;

                  return (
                    <button
                      key={l.id}
                      onClick={() => {
                        if (canAccess) {
                          navigate(`/courses/${courseId}/lessons/${l.id}`);
                        }
                      }}
                      disabled={!canAccess}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isCurrent
                          ? "bg-primary-100 border-2 border-primary-600"
                          : canAccess
                          ? "border border-gray-200 hover:border-primary-300 hover:shadow-sm"
                          : "border border-gray-200 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCurrent
                                ? "bg-primary-600 text-white"
                                : "bg-primary-100 text-primary-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {l.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {Math.floor(l.duration / 60)}m
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          {!canAccess && (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          {l.isFree && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
