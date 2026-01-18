import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_COURSE } from "../graphql/queries";
import { UPDATE_COURSE, UPLOAD_IMAGE } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { Upload, X } from "lucide-react";
import { type Course } from "../types";
import { compressImage } from "../utils/imageCompression";
import { useToastStore } from "../store/toastStore";

interface GetCourseData {
  getCourse: Course;
}

interface UpdateCourseData {
  updateCourse: Course;
}

interface UploadImageData {
  uploadImage: {
    url: string;
    publicId: string;
    format: string;
  };
}

const EditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading } = useQuery<GetCourseData>(GET_COURSE, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8" />
          <div className="h-48 bg-gray-300 rounded mb-6" />
          <div className="h-10 bg-gray-300 rounded mb-4" />
          <div className="h-32 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  if (!data?.getCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Course not found</p>
          <button
            onClick={() => navigate("/instructor/dashboard")}
            className="btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <EditCourseForm course={data.getCourse} />;
};

const EditCourseForm = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  // ✅ State initialized ONCE from props
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price,
    level: course.level,
    thumbnail: course.thumbnail || "",
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(
    course.thumbnail || ""
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { addToast } = useToastStore();

  const [uploadImage] = useMutation<UploadImageData>(UPLOAD_IMAGE);

  const [updateCourse, { loading }] = useMutation<UpdateCourseData>(
    UPDATE_COURSE,
    {
      onCompleted: () => {
        addToast("Course updated successfully!", "success");
        navigate("/instructor/dashboard");
      },
      onError: () => addToast("Error creating course", "error"),
    }
  );

  const handleThumbnailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);

      try {
        const compressedBase64 = await compressImage(file, 1200, 0.8);
        setThumbnailPreview(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        addToast(
          "Error processing image. Please try a different image.",
          "error"
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let thumbnailUrl = formData.thumbnail;

      if (thumbnailFile && thumbnailPreview.startsWith("data:")) {
        setUploading(true);

        const { data } = await uploadImage({
          variables: {
            file: thumbnailPreview,
            folder: "thumbnails",
          },
        });

        if (data?.uploadImage?.url) {
          thumbnailUrl = data.uploadImage.url;
        }

        setUploading(false);
      }

      await updateCourse({
        variables: {
          id: course.id,
          input: {
            ...formData,
            price: Number(formData.price),
            thumbnail: thumbnailUrl,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Course</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Course Thumbnail
            </label>

            <div className="border-2 border-dashed rounded-lg p-6">
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview("");
                      setFormData({ ...formData, thumbnail: "" });
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload thumbnail
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <input
            className="input-field"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <textarea
            className="input-field"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <input
            className="input-field"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value),
                })
              }
              required
            />

            <select
              className="input-field"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <button
            disabled={loading || uploading}
            className="btn-primary disabled:opacity-50"
          >
            {uploading ? "Uploading..." : loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
