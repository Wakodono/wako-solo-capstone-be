import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const cloudinaryAvatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "Users",
    },
  });
  
export function uploadAvatarImageToCloud(req, res, next) {
    const upload = multer({ storage: cloudinaryAvatarStorage }).single("avatar");
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        throw new Error(err);
      } else {
        next();
      }
    });
}