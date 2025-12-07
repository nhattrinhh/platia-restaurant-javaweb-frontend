// api.js

// Khai báo Base URL của API
// Đặt là 'https://api.nhat.cloud' (sau khi cấu hình Nginx có SSL)
// Hoặc 'http://api.nhat.cloud' (nếu chưa có SSL)
// Hoặc 'http://localhost:8080' (để chạy local)

// 💡 CÁCH 1: Dùng biến môi trường (Khuyến nghị cho ứng dụng thực tế)
// const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// 💡 CÁCH 2: Hardcode cho mục đích thử nghiệm nhanh
const BASE_API_URL = 'https://api.nhat.cloud'; 

// Export biến để các file khác có thể sử dụng
export default BASE_API_URL;