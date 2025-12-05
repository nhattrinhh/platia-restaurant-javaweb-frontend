import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/cart';

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

export const getCart = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        const cartData = response.data.data || response.data.cart || {};
        return {
            cartItems: cartData.cartItems || [],
            totalPrice: cartData.totalPrice || 0,
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi lấy giỏ hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const addToCart = async (token, productId, quantity) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/add`,
            null,
            {
                params: { productId, quantity },
                headers: getAuthHeaders(token),
                timeout: 5000,
            }
        );
        const cartData = response.data.data || response.data.cart || {};
        return {
            cartItems: cartData.cartItems || [],
            totalPrice: cartData.totalPrice || 0,
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi thêm vào giỏ hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const updateCartQuantity = async (token, productId, quantity) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/update`,
            null,
            {
                params: { productId, quantity },
                headers: getAuthHeaders(token),
                timeout: 5000,
            }
        );
        const cartData = response.data.data || response.data.cart || {};
        return {
            cartItems: cartData.cartItems || [],
            totalPrice: cartData.totalPrice || 0,
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi cập nhật số lượng:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const removeFromCart = async (token, productId) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/remove`,
            {
                params: { productId },
                headers: getAuthHeaders(token),
                timeout: 5000,
            }
        );
        const cartData = response.data.data || response.data.cart || {};
        return {
            cartItems: cartData.cartItems || [],
            totalPrice: cartData.totalPrice || 0,
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi xóa sản phẩm:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const clearCart = async (token) => {
    try {
        await axios.delete(`${API_BASE_URL}/clear`, {
            headers: getAuthHeaders(token),
            timeout: 5000,
        });
        return { cartItems: [], totalPrice: 0 };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Lỗi không xác định';
        console.error('Lỗi khi xóa giỏ hàng:', errorMessage);
        throw new Error(errorMessage);
    }
};