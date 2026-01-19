import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { UPDATE_LESSON } from "../graphql/mutations";
import { useToastStore } from "../store/toastStore";
import type { Lesson } from "../types";

interface Props {
  lesson: Lesson;
}

const EditLessonForm = ({ lesson }: Props) => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();

  const navigate = useNavigate();
  const { addToast } = useToastStore();

  // ✅ Initialize ONCE — no effect needed
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description || "",
    videoURL: lesson.videoURL,
    duration: lesson.duration,
    order: lesson.order,
    isFree: lesson.isFree,
  });

  const [updateLesson, { loading }] = useMutation(UPDATE_LESSON, {
    onCompleted: () => {
      addToast("Lesson updated successfully!", "success");
      navigate(`/instructor/courses/${courseId}/edit`);
    },
    onError: (err) => {
      addToast(err.message, "error");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lessonId) return;

    await updateLesson({
      variables: {
        id: lessonId,
        input: {
          ...formData,
          duration: Number(formData.duration),
          order: Number(formData.order),
        },
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Lesson</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Video URL *</label>
          <input
            type="url"
            required
            className="input-field"
            value={formData.videoURL}
            onChange={(e) =>
              setFormData({ ...formData, videoURL: e.target.value })
            }
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Lesson Title *
          </label>
          <input
            type="text"
            required
            className="input-field"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={3}
            className="input-field"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Duration & Order */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration (seconds)
            </label>
            <input
              type="number"
              min="0"
              className="input-field"
              value={formData.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration: Number(e.target.value) || 0,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Lesson Order
            </label>
            <input
              type="number"
              min="1"
              className="input-field"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: Number(e.target.value) || 1,
                })
              }
            />
          </div>
        </div>

        {/* Is Free */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.isFree}
            onChange={(e) =>
              setFormData({ ...formData, isFree: e.target.checked })
            }
          />
          <span>Make this lesson free</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Updating..." : "Update Lesson"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/instructor/courses/${courseId}/edit`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLessonForm;
