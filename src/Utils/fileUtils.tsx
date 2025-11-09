// ✅ Convert File → Base64 (for storing in localStorage)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

// ✅ Convert Base64 → File (for uploading to server)
export const base64ToFile = (base64String: unknown, filename: string): File | null => {
  if (typeof base64String !== "string") {
    console.warn("⚠️ Invalid base64String:", base64String);
    return null;
  }
  try {
    const base64WithoutPrefix = base64String.split(",")[1] || base64String;
    const binaryString = atob(base64WithoutPrefix);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const mimeMatch = base64String.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    return new File([bytes], filename, { type: mimeType });
  } catch (err) {
    console.error("Error converting base64 to file:", err);
    return null;
  }
};
