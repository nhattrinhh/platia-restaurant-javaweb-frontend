import axios from 'axios';
const PROVINCE_API_ENDPOINT = 'https://provinces.open-api.vn/api';

export const getProvinces = async () => {
    try {
        const response = await axios.get(`${PROVINCE_API_ENDPOINT}/p/`, { timeout: 5000 });
        return response.data.map(p => ({ value: p.code, label: p.name }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách tỉnh:', error.message);
        throw new Error('Không thể lấy danh sách tỉnh/thành phố');
    }
};

export const getDistricts = async (provinceCode) => {
    try {
        const response = await axios.get(`${PROVINCE_API_ENDPOINT}/p/${provinceCode}?depth=2`, { timeout: 5000 });
        return response.data.districts.map(d => ({ value: d.code, label: d.name }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách quận/huyện:', error.message);
        throw new Error('Không thể lấy danh sách quận/huyện');
    }
};

export const getWards = async (districtCode) => {
    try {
        const response = await axios.get(`${PROVINCE_API_ENDPOINT}/d/${districtCode}?depth=2`, { timeout: 5000 });
        return response.data.wards.map(w => ({ value: w.code, label: w.name }));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phường/xã:', error.message);
        throw new Error('Không thể lấy danh sách phường/xã');
    }
};