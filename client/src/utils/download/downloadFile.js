import { saveAs } from "file-saver";

export const downloadFile = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileName = url.split("/").pop(); // Extract file name from URL
    saveAs(blob, fileName);
  } catch (error) {
    console.error("Error downloading file:", error);
    Swal.fire({
      icon: "error",
      title: "Download Failed",
      text: error.message || "An error occurred while downloading the file.",
    });
  }
};
