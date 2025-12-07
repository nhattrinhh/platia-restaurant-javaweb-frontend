import axios from 'axios';
import BASE_API_URL from '../../utils/api';
const API_ENDPOINT = `${BASE_API_URL}/api`;

export const getProductTypes = async (token) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/product-types`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách loại sản phẩm.';
    }
};

export const createProductType = async (token, productTypeData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/product-types`, productTypeData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể thêm loại sản phẩm.';
    }
};

export const updateProductType = async (token, id, productTypeData) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/product-types/${id}`, productTypeData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể cập nhật loại sản phẩm.';
    }
};

export const deleteProductType = async (token, id) => {
    try {
        await axios.delete(`${API_ENDPOINT}/product-types/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa loại sản phẩm.';
    }
};