import axios from 'axios';

const API_URL = 'http://localhost:8080/api/user';

export const getProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Không thể tải thông tin người dùng.';
    }
};

export const updateProfile = async (token, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/profile`, profileData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Không thể cập nhật thông tin.';
    }
};

export const updateAdminProfile = async (token, profileData) => {
    try {
        const response = await axios.put(`${API_URL}/admin/profile`, profileData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Không thể cập nhật thông tin admin.';
    }
};

export const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách người dùng. Vui lòng kiểm tra token hoặc quyền.';
    }
};

export const deleteUser = async (token, username) => {
    try {
        await axios.delete(`${API_URL}/delete/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa người dùng. Vui lòng kiểm tra quyền.';
    }
};

export const createUser = async (token, userData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể thêm người dùng.';
    }
};