import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COURSE } from "../graphql/queries";
import { CREATE_LESSON, UPLOAD_VIDEO } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { Upload, X } from "lucide-react";
import { useToastStore } from "../store/toastStore";

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

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: courseData } = useQuery(GET_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  const [uploadVideo] = useMutation(UPLOAD_VIDEO);
  const [createLesson, { loading }] = useMutation(CREATE_LESSON, {
    onCompleted: () => {
      addToast("Lesson created successfully!", "success");
      navigate(`/instructor/courses/${courseId}/edit`);
    },
    onError: (err) => {
      addToast(err.message, "error");
    },
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        addToast("Video file must be less than 100MB", "error");
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile && !formData.videoURL) {
      addToast("Please upload a video or provide a video URL", "error");
      return;
    }

    try {
      let videoURL = formData.videoURL;

      // Upload video if file selected
      if (videoFile) {
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Video = reader.result as string;
          const { data } = await uploadVideo({
            variables: {
              file: base64Video,
              folder: "lessons",
            },
          });

          if (data?.uploadVideo?.url) {
            videoURL = data.uploadVideo.url;
          }
          setUploading(false);

          // Create lesson after upload
          await createLesson({
            variables: {
              input: {
                ...formData,
                videoURL,
                courseId,
                duration: parseInt(formData.duration.toString()),
                order: parseInt(formData.order.toString()),
              },
            },
          });
        };
        reader.readAsDataURL(videoFile);
      } else {
        // Create lesson with URL
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
      }
    } catch (err) {
      console.error("Error creating lesson:", err);
      setUploading(false);
    }
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
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Upload (or provide URL below)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {videoFile ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {videoFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload video (Max 100MB)
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Video URL (YouTube, Vimeo, etc.)
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://..."
              value={formData.videoURL}
              onChange={(e) =>
                setFormData({ ...formData, videoURL: e.target.value })
              }
            />
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
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
              />
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
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
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
              disabled={loading || uploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading
                ? "Uploading Video..."
                : loading
                ? "Creating..."
                : "Create Lesson"}
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
