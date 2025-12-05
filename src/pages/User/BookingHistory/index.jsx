import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaTimes, FaEye, FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaUtensils, FaHourglassHalf, FaCheckCircle, FaBoxOpen, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBookingHistory, getBookingDetails, cancelBooking } from '../../../services/api/bookingService';

// Status Icon Component
const StatusIcon = ({ status }) => {
    switch (status) {
        case 'PENDING':
            return <FaHourglassHalf className="w-6 h-6 text-yellow-600" />;
        case 'CONFIRMED':
            return <FaCheckCircle className="w-6 h-6 text-blue-600" />;
        case 'CANCELLED':
            return <FaTimesCircle className="w-6 h-6 text-red-600" />;
        case 'CANCEL_REQUESTED':
            return <FaQuestionCircle className="w-6 h-6 text-orange-600" />;
        default:
            return <FaQuestionCircle className="w-6 h-6 text-gray-600" />;
    }
};

// Status Description Component
const StatusDescription = ({ status }) => {
    const getStatusInfo = () => {
        switch (status) {
            case 'PENDING':
                return {
                    title: 'Chờ xác nhận',
                    description: 'Đơn đặt bàn của bạn đang chờ nhà hàng xác nhận.',
                    color: 'text-yellow-800',
                    bgColor: 'bg-yellow-100 border-yellow-200',
                    icon: <FaHourglassHalf className="w-5 h-5 text-yellow-600" />
                };
            case 'CONFIRMED':
                return {
                    title: 'Đã xác nhận',
                    description: 'Đơn đặt bàn đã được xác nhận. Chúng tôi đang chờ đón bạn!',
                    color: 'text-blue-800',
                    bgColor: 'bg-blue-100 border-blue-200',
                    icon: <FaCheckCircle className="w-5 h-5 text-blue-600" />
                };
            case 'CANCELLED':
                return {
                    title: 'Đã hủy',
                    description: 'Đơn đặt bàn đã được hủy.',
                    color: 'text-red-800',
                    bgColor: 'bg-red-100 border-red-200',
                    icon: <FaTimesCircle className="w-5 h-5 text-red-600" />
                };
            case 'CANCEL_REQUESTED':
                return {
                    title: 'Yêu cầu hủy',
                    description: 'Yêu cầu hủy đơn đặt bàn đang chờ admin phê duyệt.',
                    color: 'text-orange-800',
                    bgColor: 'bg-orange-100 border-orange-200',
                    icon: <FaQuestionCircle className="w-5 h-5 text-orange-600" />
                };
            default:
                return {
                    title: status,
                    description: 'Trạng thái không xác định.',
                    color: 'text-gray-800',
                    bgColor: 'bg-gray-100 border-gray-200',
                    icon: <FaQuestionCircle className="w-5 h-5 text-gray-600" />
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className={`flex items-center space-x-3 p-4 rounded-lg border shadow-sm ${statusInfo.bgColor}`}>
            <StatusIcon status={status} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    {statusInfo.icon}
                    <h4 className={`font-semibold text-lg ${statusInfo.color}`}>
                        {statusInfo.title}
                    </h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {statusInfo.description}
                </p>
            </div>
        </div>
    );
};

// Booking Detail Modal Component
const BookingDetailModal = ({ booking, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 pt-20">
            <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full mx-4 p-5 max-h-[90vh] overflow-y-auto border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <FaUtensils className="text-white text-lg" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-indigo-900">
                                Chi tiết đơn đặt bàn
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">Thông tin chi tiết về đơn đặt bàn</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Customer Information Section */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <FaUsers className="text-indigo-600 text-lg" />
                                <h3 className="text-lg font-semibold text-indigo-900">Thông tin khách hàng</h3>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Họ và tên</p>
                                    <p className="text-sm font-semibold text-gray-900">{booking.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Số điện thoại</p>
                                    <p className="text-sm font-semibold text-gray-900">{booking.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information Section */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <FaCalendarAlt className="text-indigo-600 text-lg" />
                                <h3 className="text-lg font-semibold text-indigo-900">Thông tin đặt bàn</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Ngày đặt</p>
                                    <p className="text-sm font-semibold text-indigo-700">
                                        {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Giờ đặt</p>
                                    <p className="text-sm font-semibold text-indigo-700">{booking.bookingTime}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Số khách</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-6 h-6 bg-indigo-500 rounded-full">
                                            <span className="text-white text-xs font-semibold">{booking.numberOfGuests}</span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">người</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Khu vực</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {booking.area === 'indoor' ? 'Khu vực chính' :
                                            booking.area === 'vip' ? 'Phòng VIP' :
                                                booking.area === 'outdoor' ? 'Khu vườn' :
                                                    booking.area === 'terrace' ? 'Sân thượng' : booking.area}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Special Requests Section */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <FaMapMarkerAlt className="text-indigo-600 text-lg" />
                                <h3 className="text-lg font-semibold text-indigo-900">Yêu cầu đặc biệt</h3>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg min-h-[100px]">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {booking.specialRequests || 'Không có yêu cầu đặc biệt'}
                                </p>
                            </div>
                        </div>

                        {/* Status and System Information */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <FaUtensils className="text-indigo-600 text-lg" />
                                <h3 className="text-lg font-semibold text-indigo-900">Thông tin hệ thống</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-2">Trạng thái đơn đặt bàn</p>
                                    <StatusDescription status={booking.status} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Thời gian tạo</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex justify-end gap-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium text-sm"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 7; // Changed from 10 to 7

    // Fetch booking history on component mount
    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập để xem lịch sử đặt bàn.');
                setLoading(false);
                return;
            }

            try {
                const data = await getBookingHistory(token);
                setBookings(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Đã có lỗi xảy ra khi lấy lịch sử đặt bàn.');
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Handle cancel booking
    const handleCancel = async (id) => {
        Swal.fire({
            title: 'Xác nhận yêu cầu hủy đơn',
            text: 'Bạn có chắc chắn muốn yêu cầu hủy đơn đặt bàn này? Yêu cầu sẽ được gửi đến admin để phê duyệt.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy bỏ',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium text-sm',
                cancelButton: 'px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-sm',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('token');
                try {
                    const updatedBooking = await cancelBooking(token, id);
                    setBookings(bookings.map((booking) => (booking.id === id ? updatedBooking : booking)));
                    toast.success('Yêu cầu hủy đơn đã được gửi! Vui lòng chờ admin phê duyệt.', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    });
                } catch (err) {
                    toast.error(err.message || 'Lỗi khi gửi yêu cầu hủy đơn đặt bàn.', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    });
                }
            }
        });
    };

    // Handle view booking details
    const handleViewDetails = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const bookingDetails = await getBookingDetails(token, id);
            setSelectedBooking(bookingDetails);
        } catch (err) {
            toast.error(err.message || 'Lỗi khi lấy chi tiết đơn đặt bàn.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        }
    };

    // Format status for display
    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'CANCELLED':
                return 'Đã hủy';
            case 'CANCEL_REQUESTED':
                return 'Yêu cầu hủy';
            default:
                return status;
        }
    };

    // Format area for display
    const formatArea = (area) => {
        switch (area) {
            case 'indoor':
                return 'Khu vực chính';
            case 'vip':
                return 'Phòng VIP';
            case 'outdoor':
                return 'Khu vườn';
            case 'terrace':
                return 'Sân thượng';
            default:
                return area;
        }
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'CANCEL_REQUESTED':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get area badge styling
    const getAreaBadge = (area) => {
        switch (area) {
            case 'indoor':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'vip':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'outdoor':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'terrace':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Pagination logic
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-lg mb-3">
                        <FaUtensils className="text-white text-xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-indigo-900">Lịch Sử Đặt Bàn</h1>
                    <p className="text-gray-600 text-sm mt-2">Theo dõi và quản lý các đơn đặt bàn của bạn tại Platia Restaurant</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg flex items-center space-x-2">
                        <FaTimes className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative mb-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200"></div>
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium">Đang tải lịch sử đặt bàn...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-lg mb-3">
                                <FaUtensils className="text-white text-xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Chưa có đơn đặt bàn</h3>
                            <p className="text-gray-600 text-sm mb-4">Bạn chưa có lịch sử đặt bàn. Hãy bắt đầu bằng cách đặt bàn ngay hôm nay!</p>
                            <Link
                                to="/booking"
                                className="inline-flex items-center px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium text-sm"
                            >
                                <FaUtensils className="w-4 h-4 mr-2" />
                                Đặt bàn ngay
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-50 text-indigo-900 border-b border-gray-200">
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Khách hàng</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Thời gian</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Số khách</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Khu vực</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Yêu cầu</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Trạng thái</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs font-semibold">
                                                                {booking.fullName.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{booking.fullName}</p>
                                                            <p className="text-gray-600 text-xs">{booking.phoneNumber}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <FaCalendarAlt className="text-indigo-600 w-4 h-4" />
                                                            <p className="font-semibold text-gray-900 text-sm">
                                                                {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FaClock className="text-indigo-600 w-4 h-4" />
                                                            <p className="font-semibold text-indigo-700 text-sm">{booking.bookingTime}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                                            <FaUsers className="text-white text-xs" />
                                                        </div>
                                                        <span className="font-semibold text-gray-900 text-sm">{booking.numberOfGuests} người</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getAreaBadge(booking.area)}`}>
                                                        <FaMapMarkerAlt className="mr-1 w-3 h-3" />
                                                        {formatArea(booking.area)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <p className="text-xs text-gray-600 truncate bg-gray-100 px-2 py-1 rounded-lg max-w-xs" title={booking.specialRequests}>
                                                        {booking.specialRequests || 'Không có'}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getStatusBadge(booking.status)}`}>
                                                        {formatStatus(booking.status)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(booking.id)}
                                                            className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye className="w-4 h-4" />
                                                        </button>
                                                        {booking.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleCancel(booking.id)}
                                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                                                title="Yêu cầu hủy đơn"
                                                            >
                                                                <FaTimes className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4 p-4">
                                {currentBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">
                                                        {booking.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-sm">{booking.fullName}</h3>
                                                    <p className="text-indigo-600 text-xs font-medium">{booking.phoneNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(booking.id)}
                                                    className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                {booking.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                                        title="Yêu cầu hủy đơn"
                                                    >
                                                        <FaTimes className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status Section */}
                                        <div className="mb-3">
                                            <StatusDescription status={booking.status} />
                                        </div>

                                        {/* Booking Details Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaCalendarAlt className="text-indigo-600 w-4 h-4" />
                                                    <p className="text-xs font-medium text-gray-500 uppercase">Ngày & Giờ</p>
                                                </div>
                                                <p className="font-semibold text-gray-900 text-sm">
                                                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                                                </p>
                                                <p className="text-indigo-700 text-sm font-medium">{booking.bookingTime}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaUsers className="text-indigo-600 w-4 h-4" />
                                                    <p className="text-xs font-medium text-gray-500 uppercase">Chi tiết</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-semibold">{booking.numberOfGuests}</span>
                                                    </div>
                                                    <span className="text-gray-900 text-sm font-medium">người</span>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium mt-2 ${getAreaBadge(booking.area)}`}>
                                                    <FaMapMarkerAlt className="mr-1 w-3 h-3" />
                                                    {formatArea(booking.area)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Special Requests */}
                                        {booking.specialRequests && (
                                            <div className="bg-gray-50 rounded-lg p-3 mt-3 border border-gray-200">
                                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Yêu cầu đặc biệt</p>
                                                <p className="text-gray-700 text-xs leading-relaxed">{booking.specialRequests}</p>
                                            </div>
                                        )}

                                        {/* Created timestamp */}
                                        <div className="text-right mt-3">
                                            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                                Đặt lúc: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {bookings.length > bookingsPerPage && (
                                <div className="flex justify-center items-center gap-2 py-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages).keys()].map((page) => (
                                        <button
                                            key={page + 1}
                                            onClick={() => handlePageChange(page + 1)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Booking Detail Modal */}
                {selectedBooking && (
                    <BookingDetailModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                    />
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                    <Link
                        to="/booking"
                        className="inline-flex items-center px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium text-sm"
                    >
                        <FaUtensils className="w-4 h-4 mr-2" />
                        Đặt Bàn Mới
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Quay Lại Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BookingHistory;