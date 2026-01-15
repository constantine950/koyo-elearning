import cloudinary from "../config/cloudinary";
import { GraphQLError } from "graphql";

interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
}

export const uploadToCloudinary = async (
  file: string,
  folder: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<UploadResult> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `koyo/${folder}`,
      resource_type: resourceType,
      ...(resourceType === "video" && {
        chunk_size: 6000000, // 6MB chunks for large videos
        eager: [{ streaming_profile: "hd", format: "m3u8" }],
        eager_async: true,
      }),
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    };
  } catch (error: any) {
    throw new GraphQLError(`Upload failed: ${error.message}`, {
      extensions: { code: "UPLOAD_ERROR" },
    });
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error: any) {
    console.error(`Failed to delete file: ${error.message}`);
  }
};
