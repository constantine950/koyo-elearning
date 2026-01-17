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

  const { data: courseData } = useQuery<GetCourseData>(GET_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const { data: lessonData } = useQuery<GetLessonData>(GET_LESSON, {
    variables: { id: lessonId },
    skip: !lessonId,
  });

  const { data: enrolledData } = useQuery<IsEnrolledData>(IS_ENROLLED, {
    variables: { courseId },
    skip: !user || !courseId,
  });

  const [markComplete] = useMutation(MARK_LESSON_COMPLETE, {
    onCompleted: () => {
      setCompleted(true);
      alert("Lesson marked as complete!");
    },
  });

  const course = courseData?.getCourse;
  const lesson = lessonData?.getLesson;
  const isEnrolled = enrolledData?.isEnrolled || false;

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isEnrolled && !lesson.isFree) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="card text-center">
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
    if (!completed && lessonId) {
      await markComplete({
        variables: { lessonId },
      });
    }
  };

  const handleMarkComplete = async () => {
    if (lessonId) {
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
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Course
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer videoURL={lesson.videoURL} onEnded={handleVideoEnd} />

            <div className="card mt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                  {lesson.description && (
                    <p className="text-gray-600">{lesson.description}</p>
                  )}
                </div>

                {isEnrolled && (
                  <button
                    onClick={handleMarkComplete}
                    disabled={completed}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                      completed
                        ? "bg-green-100 text-green-700"
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
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous Lesson
                  </button>
                ) : (
                  <div></div>
                )}

                {nextLesson ? (
                  <button
                    onClick={() =>
                      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
                    }
                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
                  >
                    Next Lesson
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson List Sidebar */}
          <div>
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((l, index) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      if (isEnrolled || l.isFree) {
                        navigate(`/courses/${courseId}/lessons/${l.id}`);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      l.id === lessonId
                        ? "bg-primary-100 border-2 border-primary-600"
                        : "border border-gray-200 hover:border-primary-300"
                    } ${!isEnrolled && !l.isFree ? "opacity-50" : ""}`}
                    disabled={!isEnrolled && !l.isFree}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{l.title}</p>
                          <p className="text-xs text-gray-500">
                            {Math.floor(l.duration / 60)}m
                          </p>
                        </div>
                      </div>

                      {!isEnrolled && !l.isFree && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}

                      {l.isFree && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Free
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;
