const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (
  fileBuffer,
  resourceType = "auto",
  folder = null
) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = { resource_type: resourceType };
    if (folder) {
      uploadOptions.folder = folder;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        resolve({
          publicId: result.public_id,
          src: result.secure_url,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
