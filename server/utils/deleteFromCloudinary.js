const cloudinary = require("cloudinary").v2;

const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary delete error:", error);
        return reject(error);
      } else {
        console.log("Cloudinary delete result:", result);
        resolve(result);
      }
    });
  });
};

module.exports = deleteFromCloudinary;
