import { storage } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default async function upload(uri: string, name: string) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(storage, `images/${name}`);
    const result = await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(result.ref);
    const metadata = result.metadata;

    return { downloadURL, metadata };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}
