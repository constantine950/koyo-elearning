import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COURSE } from "../graphql/queries";
import { CREATE_LESSON } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { useToastStore } from "../store/toastStore";
import type { Course } from "../types";

interface GetCourseData {
  getCourse: Course;
}

const CreateLesson = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoURL: "",
    duration: 0,
    order: 1,
    isFree: false,
  });

  const { data: courseData } = useQuery<GetCourseData>(GET_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const [createLesson, { loading }] = useMutation(CREATE_LESSON, {
    onCompleted: () => {
      addToast("Lesson created successfully!", "success");
      navigate(`/instructor/courses/${courseId}/edit`);
    },
    onError: (err) => {
      addToast(err.message, "error");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.videoURL.trim()) {
      addToast("Please provide a video URL", "error");
      return;
    }

    await createLesson({
      variables: {
        input: {
          ...formData,
          courseId,
          duration: parseInt(formData.duration.toString()),
          order: parseInt(formData.order.toString()),
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Add New Lesson</h1>
        <p className="text-gray-600 mb-8">
          Course: {courseData?.getCourse?.title}
        </p>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL * (YouTube, Vimeo, or direct link)
            </label>
            <input
              type="url"
              required
              className="input-field"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.videoURL}
              onChange={(e) =>
                setFormData({ ...formData, videoURL: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a valid video URL from YouTube, Vimeo, or a direct video
              link
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Introduction to TypeScript"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="input-field"
              placeholder="What will students learn in this lesson?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Duration and Order */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds) *
              </label>
              <input
                type="number"
                required
                min="0"
                className="input-field"
                placeholder="600"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.duration > 0 &&
                  `≈ ${Math.floor(formData.duration / 60)} minutes`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Order *
              </label>
              <input
                type="number"
                required
                min="1"
                className="input-field"
                placeholder="1"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
          </div>

          {/* Is Free */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFree"
              checked={formData.isFree}
              onChange={(e) =>
                setFormData({ ...formData, isFree: e.target.checked })
              }
              className="w-5 h-5 text-primary-600 rounded"
            />
            <label
              htmlFor="isFree"
              className="text-sm font-medium text-gray-700"
            >
              Make this lesson free (preview lesson)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Lesson"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/instructor/courses/${courseId}/edit`)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLesson;
