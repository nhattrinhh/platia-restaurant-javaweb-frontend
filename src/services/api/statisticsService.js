import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/statistics';

const getAuthHeaders = (token) => {
    if (!token) {
        console.warn('Không tìm thấy token trong localStorage');
        return {};
    }
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const getAllCategories = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy danh sách danh mục:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getAllProductTypes = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/product-types`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy danh sách loại sản phẩm:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getTopPopularDishes = async (token, limit = 3) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/top-dishes`, {
            params: { limit },
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy danh sách món ăn nổi bật:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getRecentActivities = async (token, limit = 7) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recent-activities`, {
            params: { limit },
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy hoạt động gần đây:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getTopUsers = async (token, limit = 3) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/top-users`, {
            params: { limit },
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy danh sách người dùng nổi bật:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getQuickSummary = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/summary`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy tóm tắt nhanh:', errorMessage);
        throw new Error(errorMessage);
    }
};