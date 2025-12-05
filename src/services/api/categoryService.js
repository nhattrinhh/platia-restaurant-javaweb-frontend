import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getCategories = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách danh mục.';
    }
};

export const createCategory = async (token, categoryData) => {
    try {
        const response = await axios.post(`${API_URL}/categories`, categoryData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể thêm danh mục.';
    }
};

export const updateCategory = async (token, id, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể cập nhật danh mục.';
    }
};

export const deleteCategory = async (token, id) => {
    try {
        await axios.delete(`${API_URL}/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa danh mục.';
    }
};