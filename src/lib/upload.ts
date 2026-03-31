import api from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url; // Mengembalikan URL S3 dari Go
};
