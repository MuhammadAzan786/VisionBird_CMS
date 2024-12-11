export const deleteCloudinaryFolder = async (folderName) => {
  const filesInFolder = await cloudinary.api.resources({
    type: "upload",
    prefix: folderName + "/",
    max_results: 1,
  });

  console.log("Files length:", filesInFolder.resources.length);

  if (filesInFolder.resources.length === 0) {
    // Delete the folder if it's empty
    cloudinary.api.delete_folder(folderName, (error, result) => {
      if (error.http_code === 404) {
        console.log(error.message);
      } else {
        console.log("Folder deleted successfully:", result);
      }
    });
  }
};
