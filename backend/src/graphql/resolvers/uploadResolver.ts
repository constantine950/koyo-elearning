import { uploadToCloudinary } from "../../utils/fileUpload";
import { requireAuth } from "../../middlewares/auth";
import { Context } from "../../types/context";
import { GraphQLError } from "graphql";

export const uploadResolvers = {
  Mutation: {
    uploadImage: async (
      _: any,
      { file, folder }: { file: string; folder: string },
      context: Context
    ) => {
      requireAuth(context);

      // Validate base64 string
      if (!file.startsWith("data:image/")) {
        throw new GraphQLError(
          "Invalid image format. Must be a base64 encoded image",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }

      try {
        const result = await uploadToCloudinary(file, folder, "image");
        return {
          url: result.url,
          publicId: result.publicId,
          format: result.format,
        };
      } catch (error: any) {
        throw new GraphQLError(`Image upload failed: ${error.message}`, {
          extensions: { code: "UPLOAD_ERROR" },
        });
      }
    },

    uploadVideo: async (
      _: any,
      { file, folder }: { file: string; folder: string },
      context: Context
    ) => {
      requireAuth(context);

      // Validate base64 string
      if (!file.startsWith("data:video/")) {
        throw new GraphQLError(
          "Invalid video format. Must be a base64 encoded video",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }

      try {
        const result = await uploadToCloudinary(file, folder, "video");
        return {
          url: result.url,
          publicId: result.publicId,
          format: result.format,
        };
      } catch (error: any) {
        throw new GraphQLError(`Video upload failed: ${error.message}`, {
          extensions: { code: "UPLOAD_ERROR" },
        });
      }
    },
  },
};
