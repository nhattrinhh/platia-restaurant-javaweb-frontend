import React, { useState, useEffect } from 'react';
import { FaUtensils, FaUsers, FaClipboardList, FaChartBar, FaStar, FaHamburger, FaArrowUp, FaArrowDown, FaUserCircle, FaCalendar } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Calendar, ChevronDown, X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateAdminProfile } from '../../../services/api/userService';
import { getAllProductTypes, getRecentActivities } from '../../../services/api/statisticsService';

// Toast Notification Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 animate-slide-in ${type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
            {type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="font-medium flex-1">{message}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({
        username: '',
        email: '',
        fullname: '',
        address: '',
        phoneNumber: ''
    });
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileForm, setProfileForm] = useState(admin);
    const [selectedTab, setSelectedTab] = useState('Tổng quan');
    const [startDate, setStartDate] = useState('2025-07-24');
    const [endDate, setEndDate] = useState('2025-07-30');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [foodProductType, setFoodProductType] = useState([]);
    const [activities, setActivities] = useState([]);
    const [productTypeLoading, setProductTypeLoading] = useState(false);
    const [activityLoading, setActivityLoading] = useState(false);
    const token = localStorage.getItem('token');

    // Màu sắc cho biểu đồ tròn
    const COLORS = ['#3b82f6', '#22c55e', '#facc15', '#ef4444', '#a855f7'];

    // Load thông tin admin và dữ liệu từ API khi component mount
    useEffect(() => {
        if (!token) {
            setToast({ message: 'Vui lòng đăng nhập để xem thông tin admin.', type: 'error' });
            navigate('/login');
            return;
        }

        // Load thông tin admin
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await getProfile(token);
                setAdmin(response);
                setProfileForm({
                    username: response.username || '',
                    email: response.email || '',
                    fullname: response.fullname || '',
                    address: response.address || '',
                    phoneNumber: response.phoneNumber || '',
                });
            } catch (error) {
                let errorMsg = error.message || 'Lỗi khi tải thông tin admin.';
                if (error.response?.status === 401) {
                    errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setToast({ message: errorMsg, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        // Load danh sách loại sản phẩm
        const fetchProductTypes = async () => {
            setProductTypeLoading(true);
            try {
                const productTypes = await getAllProductTypes(token);

                const formattedProductTypes = productTypes.map((productType, index) => ({
                    name: productType.name,
                    value: productType.percentage || Math.floor(Math.random() * 20) + 10,
                    color: COLORS[index % COLORS.length]
                }));
                setFoodProductType(formattedProductTypes);
            } catch (error) {
                setToast({ message: 'Lỗi khi tải danh sách loại sản phẩm.', type: 'error' });
            } finally {
                setProductTypeLoading(false);
            }
        };

        // Load hoạt động gần đây
        const fetchActivities = async () => {
            setActivityLoading(true);
            try {
                const activitiesData = await getRecentActivities(token, 4); // Lấy 5 hoạt động gần nhất
                // Giả sử API trả về danh sách chuỗi dạng "Hoạt động: {text} | {time}"
                // Cần parse để phù hợp với giao diện
                const formattedActivities = activitiesData.map((activity, index) => {
                    const [text, time] = activity.split(' | '); // Giả sử chuỗi có định dạng "text | time"
                    const types = ['Mới', 'Thành công', 'Chờ', 'Đánh giá', 'Hủy'];
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                    return {
                        type: types[index % types.length], // Gán type dựa trên index hoặc logic từ backend
                        color: colors[index % colors.length],
                        text: text || activity, // Nếu không parse được, dùng nguyên chuỗi
                        time: time || '2 giờ trước'
                    };
                });
                setActivities(formattedActivities);
            } catch (error) {
                setToast({ message: 'Lỗi khi tải hoạt động gần đây.', type: 'error' });
            } finally {
                setActivityLoading(false);
            }
        };

        fetchProfile();
        fetchProductTypes();
        fetchActivities();
    }, [navigate, token]);

    // Dữ liệu demo còn lại giữ nguyên
    const stats = [
        { label: 'Tổng số món ăn', value: 85, icon: <FaUtensils />, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { label: 'Người dùng', value: 620, icon: <FaUsers />, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600' },
        { label: 'Đơn hàng', value: 450, icon: <FaClipboardList />, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
        { label: 'Đánh giá', value: 4.7, icon: <FaStar />, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
        { label: 'Doanh thu (triệu)', value: 780, icon: <FaChartBar />, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-600' },
    ];

    const revenueData = [
        { name: 'T1', revenue: 100, target: 120 },
        { name: 'T2', revenue: 130, target: 140 },
        { name: 'T3', revenue: 160, target: 150 },
        { name: 'T4', revenue: 190, target: 180 },
        { name: 'T5', revenue: 150, target: 160 },
        { name: 'T6', revenue: 210, target: 200 },
        { name: 'T7', revenue: 180, target: 190 },
        { name: 'T8', revenue: 220, target: 210 },
        { name: 'T9', revenue: 240, target: 230 },
        { name: 'T10', revenue: 200, target: 220 },
        { name: 'T11', revenue: 260, target: 250 },
        { name: 'T12', revenue: 280, target: 270 }
    ];

    const topFoods = [
        { name: 'Pizza Hải Sản', orders: 72, rating: 4.8 },
        { name: 'Phở Bò', orders: 65, rating: 4.9 },
        { name: 'Hamburger Gà', orders: 50, rating: 4.6 },
    ];

    const notableAccounts = [
        {
            name: 'Nguyễn Văn A',
            lastBooking: '2025-07-29 19:00',
            lastOrder: 'Pizza Hải Sản',
            totalSpent: '5.2 triệu',
            orderCount: 12,
            time: 'Hôm qua'
        },
        {
            name: 'Trần Thị B',
            lastBooking: '2025-07-28 18:30',
            lastOrder: 'Phở Bò',
            totalSpent: '3.8 triệu',
            orderCount: 8,
            time: '2 ngày trước'
        },
        {
            name: 'Lê Văn C',
            lastBooking: '2025-07-27 20:00',
            lastOrder: 'Hamburger Gà',
            totalSpent: '2.1 triệu',
            orderCount: 5,
            time: '3 ngày trước'
        },
    ];

    const growthStats = [
        { label: 'Tăng trưởng doanh thu', value: '+10%', icon: <FaArrowUp />, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', desc: 'so với tháng trước' },
        { label: 'Tăng trưởng người dùng', value: '+15%', icon: <FaArrowUp />, color: 'from-cyan-500 to-cyan-600', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600', desc: 'so với tháng trước' },
        { label: 'Tăng trưởng đơn hàng', value: '-2%', icon: <FaArrowDown />, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600', desc: 'so với tháng trước' },
        { label: 'Tổng điểm đánh giá', value: 950, icon: <FaStar />, color: 'from-amber-500 to-amber-600', bgColor: 'bg-amber-50', textColor: 'text-amber-600', desc: 'từ người dùng' },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleDateChange = (type, value) => {
        if (type === 'start') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const validateForm = () => {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(profileForm.email)) {
            errors.push('Email không hợp lệ.');
        }
        if (!profileForm.fullname.trim()) {
            errors.push('Họ và tên không được để trống.');
        }
        if (profileForm.phoneNumber && !/^\+?\d{8,15}$/.test(profileForm.phoneNumber)) {
            errors.push('Số điện thoại không hợp lệ (8-15 chữ số).');
        }
        if (errors.length > 0) {
            setToast({ message: errors.join(' '), type: 'error' });
            return false;
        }
        return true;
    };

    const handleProfileChange = (e) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!token) {
            setToast({ message: 'Vui lòng đăng nhập để cập nhật thông tin.', type: 'error' });
            navigate('/login');
            return;
        }

        if (!window.confirm('Bạn có chắc muốn lưu thay đổi?')) {
            return;
        }

        setUpdateLoading(true);
        try {
            const updatedData = await updateAdminProfile(token, {
                username: admin.username,
                email: profileForm.email,
                fullname: profileForm.fullname,
                address: profileForm.address || '',
                phoneNumber: profileForm.phoneNumber || '',
            });

            setAdmin(updatedData);
            setToast({ message: 'Cập nhật thông tin admin thành công! 🎉', type: 'success' });
            setTimeout(() => {
                setShowProfileModal(false);
                setToast(null);
            }, 1500);
        } catch (error) {
            let errorMsg = error.message || 'Không thể cập nhật thông tin admin.';
            if (error.response?.status === 401) {
                errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 403) {
                errorMsg = 'Bạn không có quyền cập nhật thông tin này. Vui lòng kiểm tra vai trò admin.';
            }
            setToast({ message: errorMsg, type: 'error' });
        } finally {
            setUpdateLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border">
                    <p className="text-gray-800 font-medium">{`Tháng ${label}`}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name === 'revenue' ? 'Doanh thu' : 'Mục tiêu'}: {entry.value} triệu
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header với thông tin admin */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-white/20">
                    {loading ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="mr-4 relative cursor-pointer group" onClick={() => { setProfileForm(admin); setShowProfileModal(true); }}>
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                                        {admin.fullname ? admin.fullname.charAt(0) : 'A'}
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-md">Sửa</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Chào mừng trở lại, {admin.fullname || 'Quản trị viên'}!</h1>
                                    <p className="text-gray-600">Bảng điều khiển quản trị - {admin.email || 'admin@example.com'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toast notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}

                {/* Thống kê tăng trưởng */}
                

                {/* Các chỉ số chính */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {stats.map((item, index) => (
                        <div key={item.label} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-white/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                                    {item.icon}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-800 mb-1">{item.value}</div>
                            <div className="text-gray-600 text-sm">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Biểu đồ và thông tin chi tiết */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cột trái - Biểu đồ chính */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Biểu đồ doanh thu */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">Biểu đồ thống kê theo tháng</h3>
                                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                                    Năm 2025
                                </span>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            </linearGradient>
                                            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#6b7280' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="target"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            fill="url(#targetGradient)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            fill="url(#revenueGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-600">Doanh thu thực tế</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm text-gray-600">Mục tiêu</span>
                                </div>
                            </div>
                        </div>

                        {/* Top món ăn */}
                        <div className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800">Top món ăn nổi bật</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên món ăn</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lượt đặt</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đánh giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topFoods.map((food, idx) => (
                                            <tr key={food.name} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white mr-3">
                                                            <FaHamburger />
                                                        </div>
                                                        <span className="font-semibold text-gray-800">{food.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {food.orders}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <FaStar className="text-yellow-400 mr-1" />
                                                        <span className="font-semibold text-gray-800">{food.rating}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tài khoản nổi bật */}
                        <div className="bg-white rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800">Tài khoản nổi bật</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên khách hàng</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lần đặt bàn</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đơn hàng gần nhất</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tổng chi tiêu</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Số đơn hàng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notableAccounts.map((account, idx) => (
                                            <tr key={account.name} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-white mr-3">
                                                            <FaUserCircle />
                                                        </div>
                                                        <span className="font-semibold text-gray-800">{account.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(account.lastBooking)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{account.lastOrder}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {account.totalSpent}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        {account.orderCount}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải - Thông tin bổ sung */}
                    <div className="space-y-6">
                        {/* Biểu đồ tròn loại sản phẩm */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Loại sản phẩm</h3>
                            {productTypeLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                            ) : foodProductType.length > 0 ? (
                                <>
                                    <div className="flex justify-center mb-4">
                                        <PieChart width={200} height={200}>
                                            <Pie
                                                data={foodProductType}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {foodProductType.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </div>

                                    <div className="space-y-2">
                                        {foodProductType.map((item, index) => (
                                            <div key={item.name} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: item.color }}
                                                    ></div>
                                                    <span className="text-sm text-gray-600">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-gray-600">Không có dữ liệu loại sản phẩm.</p>
                            )}
                        </div>

                        {/* Hoạt động gần đây */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Hoạt động gần đây</h3>
                            {activityLoading ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                            ) : activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`${activity.color} text-white text-xs font-medium px-2 py-1 rounded-lg min-w-16 text-center`}>
                                                {activity.type}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800">{activity.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">Không có hoạt động nào.</p>
                            )}
                        </div>

                        {/* Tóm tắt nhanh */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Tóm tắt nhanh</h3>
                            <div className="space-y-4">
                                {stats.map((stat, index) => (
                                    <div key={stat.label} className="flex items-center justify-between py-2">
                                        <span className="text-gray-600 text-sm">{stat.label}</span>
                                        <span className={`font-bold ${stat.textColor}`}>{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal chỉnh sửa thông tin cá nhân */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl">
                        <form onSubmit={handleProfileSubmit}>
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h5 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin admin</h5>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowProfileModal(false)}
                                    disabled={updateLoading}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                                            name="username"
                                            value={profileForm.username}
                                            disabled
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            name="fullname"
                                            value={profileForm.fullname}
                                            onChange={handleProfileChange}
                                            required
                                            disabled={updateLoading}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            name="email"
                                            value={profileForm.email}
                                            onChange={handleProfileChange}
                                            required
                                            disabled={updateLoading}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            name="phoneNumber"
                                            value={profileForm.phoneNumber}
                                            onChange={handleProfileChange}
                                            disabled={updateLoading}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        name="address"
                                        value={profileForm.address}
                                        onChange={handleProfileChange}
                                        rows={4}
                                        disabled={updateLoading}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    onClick={() => setShowProfileModal(false)}
                                    disabled={updateLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        'Lưu thay đổi'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;