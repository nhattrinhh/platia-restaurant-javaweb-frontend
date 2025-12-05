import axios from 'axios';

const API_URL = 'http://localhost:8080/api/news';

export const getNews = async () => {
    try {
        const response = await axios.get(API_URL, {
            timeout: 5000,
        });
        return response.data.news;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách tin tức.';
    }
};

export const searchNews = async (token, title) => {
    try {
        const url = title ? `${API_URL}/search?title=${encodeURIComponent(title)}` : API_URL;
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
        const response = await axios.post(API_URL, newsData, {
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
        const response = await axios.put(`${API_URL}/${id}`, newsData, {
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
        await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa tin tức.';
    }
};