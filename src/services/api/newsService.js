import axios from 'axios';
import BASE_API_URL from '../../utils/api';
const API_ENDPOINT = `${BASE_API_URL}/api/news`;

export const getNews = async () => {
    try {
        const response = await axios.get(API_ENDPOINT, {
            timeout: 5000,
        });
        return response.data.news;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách tin tức.';
    }
};

export const searchNews = async (token, title) => {
    try {
        const url = title ? `${API_ENDPOINT}/search?title=${encodeURIComponent(title)}` : API_ENDPOINT;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data.news;
    } catch (error) {
        throw error.response?.data || 'Không thể tìm kiếm tin tức.';
    }
};

export const createNews = async (token, newsData) => {
    try {
        const response = await axios.post(API_ENDPOINT, newsData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data.news;
    } catch (error) {
        throw error.response?.data || 'Không thể thêm tin tức.';
    }
};

export const updateNews = async (token, id, newsData) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/${id}`, newsData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data.news;
    } catch (error) {
        throw error.response?.data || 'Không thể cập nhật tin tức.';
    }
};

export const deleteNews = async (token, id) => {
    try {
        await axios.delete(`${API_ENDPOINT}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa tin tức.';
    }
};