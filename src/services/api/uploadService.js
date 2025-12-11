import axios from 'axios';
import BASE_API_URL from '../../utils/api';
const API_ENDPOINT = `${BASE_API_URL}/api`;

/**
 * Upload file lên R2 qua backend (server-side upload - tránh CORS)
 * @param {File} file - File cần upload
 * @param {string} filename - Tên file trên R2 (có thể bao gồm path)
 * @param {string} token - JWT token (optional)
 * @returns {Promise<string>} URL công khai của file sau khi upload
 */
export const uploadToR2 = async (file, filename, token) => {
  try {
    const authToken = token || localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    const response = await axios.post(`${API_ENDPOINT}/upload/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      timeout: 30000,
    });

    return response.data.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    const serverMsg =
      error.response?.data?.message || error.response?.data || error.message;
    throw new Error(serverMsg || 'Không thể upload file lên R2.');
  }
};

/**
 * Tạo tên file duy nhất từ file gốc
 * @param {File} file - File gốc
 * @returns {string} Tên file duy nhất
 */
export const generateUniqueFilename = (file) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  return `products/${timestamp}-${random}.${extension}`;
};

/**
 * Lấy presigned URL từ backend để upload file lên Cloudflare R2 (không dùng nữa - giữ để backward compatibility)
 * @param {string} filename - Tên file sẽ upload
 * @param {string} token - JWT token (optional)
 * @returns {Promise<{presignedUrl: string, publicUrl: string}>} Presigned URL và Public URL
 */
export const getPresignedUrl = async (filename, token) => {
  try {
    const authToken = token || localStorage.getItem('token');
    const response = await axios.get(`${API_ENDPOINT}/upload/presign`, {
      params: { filename },
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      timeout: 10000,
    });
    return {
      presignedUrl: response.data.presignedUrl,
      publicUrl: response.data.publicUrl,
    };
  } catch (error) {
    throw new Error(error.response?.data || 'Không thể lấy presigned URL.');
  }
};


