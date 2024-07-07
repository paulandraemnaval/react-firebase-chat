import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Assuming you have initialized Firebase Storage correctly

const download = (filename) => {
  // Reference to the file in Firebase Storage
  const storageRef = ref(storage, `images/${filename}`);

  // Get the download URL for the file
  getDownloadURL(storageRef)
    .then((url) => {
      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename); // Set the filename for download
      document.body.appendChild(link);
      link.click(); // Trigger the click event to initiate download
      document.body.removeChild(link); // Clean up: remove the link element
    })
    .catch((error) => {
      console.error("Error getting download URL:", error);
    });
};

export default download;
