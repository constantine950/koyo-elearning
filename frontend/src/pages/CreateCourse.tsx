import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { CREATE_COURSE, UPLOAD_IMAGE } from "../graphql/mutations";
import { Navbar } from "../components/Navbar";
import { Upload, X } from "lucide-react";

interface ImageData {
  uploadImage: { url: string };
  publicId: string;
  format: string;
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    level: "BEGINNER",
    thumbnail: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [uploadImage] = useMutation<ImageData>(UPLOAD_IMAGE);
  const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
    onCompleted: () => {
      alert("Course created successfully!");
      navigate("/instructor/dashboard");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let thumbnailUrl = formData.thumbnail;

      // Upload thumbnail if selected
      if (thumbnailFile && thumbnailPreview) {
        setUploading(true);
        const { data: uploadData } = await uploadImage({
          variables: {
            file: thumbnailPreview,
            folder: "thumbnails",
          },
        });
        thumbnailUrl = uploadData!.uploadImage.url;
        setUploading(false);
      }

      // Create course
      await createCourse({
        variables: {
          input: {
            ...formData,
            thumbnail: thumbnailUrl,
            price: parseFloat(formData.price.toString()),
          },
        },
      });
    } catch (err) {
      console.error("Error creating course:", err);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {thumbnailPreview ? (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview("");
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg"
                  >
                    <X className="w-5 h-5" />
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
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
              required
              rows={4}
              className="input-field"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          {/* Price and Level */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="input-field"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
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
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : loading
                ? "Creating..."
                : "Create Course"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/instructor/dashboard")}
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

export default CreateCourse;
