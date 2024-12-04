// // cloudinaryConfig.js

// export const cloudinaryUploadWidget = (callback) => {
//   return window.cloudinary.createUploadWidget(
//     {
//       cloudName: "dp6skqcvc",
//       uploadPreset: "nai0itx1",
//       folder: "default-folder",
//       multiple: true,
//       sources: ["local"],
//       showAdvancedOptions: false,
//       cropping: false,
//       defaultSource: "local",
//       theme: "white",
//     },
//     callback // Callback to handle events like success or error
//   );
// };

// utils/cloudinaryConfig.js

export const cloudinaryConfig = {
  cloud_name: "dp6skqcvc",
  upload_preset: "nai0itx1",
  getApiUrl: (resource_type) =>
    `https://api.cloudinary.com/v1_1/dp6skqcvc/${resource_type}/upload`,
};
