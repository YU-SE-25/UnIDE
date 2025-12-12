import { api } from "./axios";

export interface PortfolioUploadResponse {
  fileUrl: string;
  originalFileName: string;
  fileSize: number;
}

export async function uploadPortfolio(
  file: File
): Promise<PortfolioUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload/portfolio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data as PortfolioUploadResponse;
}
