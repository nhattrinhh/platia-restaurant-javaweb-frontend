import axios from 'axios';
import BASE_API_URL from '../../utils/api';
const API_ENDPOINT = `${BASE_API_URL}/api`;

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

export const createOrder = async (token, orderData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/orders`, orderData, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi đặt hàng';
        console.error('Lỗi khi đặt hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const createOrderFromProduct = async (token, orderData) => {
    try {
        const response = await axios.post(`${API_ENDPOINT}/orders/create-from-product`, orderData, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data || response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi đặt hàng trực tiếp';
        console.error('Lỗi khi đặt hàng trực tiếp:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getOrders = async (token) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/orders`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data || [];
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi lấy danh sách đơn hàng';
        console.error('Lỗi khi lấy danh sách đơn hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const cancelOrder = async (token, orderId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/orders/${orderId}/cancel`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi yêu cầu hủy đơn hàng';
        console.error('Lỗi khi yêu cầu hủy đơn hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const approveCancelOrder = async (token, orderId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/orders/${orderId}/approve-cancel`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi đồng ý hủy đơn hàng';
        console.error('Lỗi khi đồng ý hủy đơn hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const rejectCancelOrder = async (token, orderId) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/orders/${orderId}/reject-cancel`, null, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi từ chối hủy đơn hàng';
        console.error('Lỗi khi từ chối hủy đơn hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteOrder = async (token, orderId) => {
    try {
        const response = await axios.delete(`${API_ENDPOINT}/orders/${orderId}/delete`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi xóa đơn hàng';
        console.error('Lỗi khi xóa đơn hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const getAdminOrders = async (token) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/orders/admin`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data || [];
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Không có quyền truy cập hoặc lỗi khi lấy danh sách đơn hàng';
        console.error('Lỗi khi lấy danh sách đơn hàng admin:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateOrderStatus = async (token, orderId, status) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/orders/${orderId}/status`, null, {
            headers: getAuthHeaders(token),
            params: { status },
            timeout: 5000,
        });
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi cập nhật trạng thái đơn hàng';
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updatePaymentStatus = async (token, orderId, status) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/orders/${orderId}/payment-status`, null, {
            headers: getAuthHeaders(token),
            params: { status },
            timeout: 5000,
        });
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi cập nhật trạng thái thanh toán';
        console.error('Lỗi khi cập nhật trạng thái thanh toán:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateDeliveryDate = async (token, orderId, deliveryDate) => {
    try {
        const response = await axios.put(`${API_ENDPOINT}/orders/${orderId}/delivery-date`, { deliveryDate }, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return response.data.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi khi cập nhật thời gian giao hàng';
        console.error('Lỗi khi cập nhật thời gian giao hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};