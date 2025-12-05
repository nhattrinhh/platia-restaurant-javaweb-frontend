import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const register = async (registerData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, registerData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Đăng ký thất bại. Vui lòng thử lại sau.';
    }
};

export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, loginData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    }
};