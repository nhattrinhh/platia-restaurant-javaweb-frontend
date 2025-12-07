import axios from 'axios';
import BASE_API_URL from '../../utils/api';
const API_ENDPOINT = `${BASE_API_URL}/api`;

export const getCategories = async (token) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/categories`, {
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
        const response = await axios.post(`${API_ENDPOINT}/categories`, categoryData, {
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
        const response = await axios.put(`${API_ENDPOINT}/categories/${id}`, categoryData, {
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
        await axios.delete(`${API_ENDPOINT}/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa danh mục.';
    }
};