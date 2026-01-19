import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { GET_LESSON } from "../graphql/queries";
import { Navbar } from "../components/Navbar";
import type { Lesson } from "../types";
import EditLessonForm from "../components/EditLessonForm";

interface GetLessonData {
  getLesson: Lesson;
}

const EditLesson = () => {
  const { lessonId } = useParams<{ lessonId: string }>();

  const { data, loading } = useQuery<GetLessonData>(GET_LESSON, {
    variables: { id: lessonId },
    skip: !lessonId,
  });

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EditLessonForm lesson={data.getLesson} />
    </div>
  );
};

export default EditLesson;
