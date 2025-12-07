import axios from 'axios';
import BASE_API_URL from '../../utils/api';
const API_ENDPOINT = `${BASE_API_URL}/booking`;

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

export const createBooking = async (token, bookingData) => {
    try {
        const response = await axios.post(
            `${API_ENDPOINT}/create`,
            bookingData,
            {
                headers: getAuthHeaders(token),
                timeout: 5000,
            }
        );
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi tạo đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookingHistory = async (token) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/history`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy lịch sử đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getBookingDetails = async (token, bookingId) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/${bookingId}`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy chi tiết đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const cancelBooking = async (token, bookingId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/user/cancel/${bookingId}`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi hủy đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getAllBookings = async (token) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/all`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy danh sách tất cả đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const confirmBooking = async (token, bookingId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/confirm/${bookingId}`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi xác nhận đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const cancelBookingByAdmin = async (token, bookingId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/cancel/${bookingId}`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi admin hủy đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteBooking = async (token, bookingId) => {
    try {
        const response = await axios.delete(`${API_ENDPOINT}/delete/${bookingId}`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi xóa đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const approveCancelBooking = async (token, bookingId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/approve-cancel/${bookingId}`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi đồng ý hủy đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const rejectCancelBooking = async (token, bookingId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/reject-cancel/${bookingId}`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi từ chối hủy đơn đặt bàn:', errorMessage);
        throw new Error(errorMessage);
    }
};