import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            timeout: 5000,
        });
        return response.data.products;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Vui lòng đăng nhập để xem thực đơn.');
        }
        throw error.response?.data || 'Không thể tải danh sách sản phẩm.';
    }
};

export const getProductTypes = async () => {
    try {
        const response = await axios.get(`${API_URL}/product-types`, {
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách loại sản phẩm.';
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`, {
            timeout: 5000,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Không thể tải danh sách danh mục.';
    }
};

export const searchProducts = async (token, name) => {
    try {
        const url = name ? `${API_URL}/products/search?name=${encodeURIComponent(name)}` : `${API_URL}/products`;
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data.products;
    } catch (error) {
        throw error.response?.data || 'Không thể tìm kiếm sản phẩm.';
    }
};

export const createProduct = async (token, productData) => {
    try {
        const response = await axios.post(`${API_URL}/products`, productData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data.product;
    } catch (error) {
        throw error.response?.data || 'Không thể thêm sản phẩm.';
    }
};

export const updateProduct = async (token, id, productData) => {
    try {
        const response = await axios.put(`${API_URL}/products/${id}`, productData, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
        return response.data.product;
    } catch (error) {
        throw error.response?.data || 'Không thể cập nhật sản phẩm.';
    }
};

export const deleteProduct = async (token, id) => {
    try {
        await axios.delete(`${API_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
        });
    } catch (error) {
        throw error.response?.data || 'Không thể xóa sản phẩm.';
    }
};

export const getBestSellingProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            timeout: 5000,
        });
        const rawProducts = Array.isArray(response.data) ? response.data : response.data.products || [];
        return rawProducts.filter(product => product.categoryName?.toLowerCase() === 'bán chạy');
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Vui lòng đăng nhập để xem sản phẩm bán chạy.');
        }
        throw error.response?.data || 'Không thể tải danh sách sản phẩm bán chạy.';
    }
};