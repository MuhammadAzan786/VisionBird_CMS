import { saveAs } from "file-saver";

export const downloadFile = (url) => {
  saveAs(url, url.split("/").pop());
};
