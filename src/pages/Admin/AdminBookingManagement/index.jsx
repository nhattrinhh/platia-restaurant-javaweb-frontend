import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCheck, FaTimes, FaTrash, FaEye, FaCheckCircle, FaBan, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getAllBookings, confirmBooking, cancelBookingByAdmin, deleteBooking, approveCancelBooking, rejectCancelBooking } from '../../../services/api/bookingService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function AdminBookingManagement() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 7; // 7 records per page

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò admin để quản lý đặt bàn.');
                setLoading(false);
                return;
            }

            try {
                const data = await getAllBookings(token);
                setBookings(data);
                setFilteredBookings(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Không có quyền truy cập hoặc lỗi khi lấy danh sách đặt bàn.');
                toast.error(err.message || 'Không thể tải danh sách đặt bàn.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    const formatArea = (area) => {
        switch (area) {
            case 'indoor': return 'Khu vực chính';
            case 'vip': return 'Phòng VIP';
            case 'outdoor': return 'Khu vườn';
            case 'terrace': return 'Sân thượng';
            default: return area || 'Không xác định';
        }
    };

    // Toggle expand row
    const toggleRow = (bookingId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(bookingId)) {
            newExpanded.delete(bookingId);
        } else {
            newExpanded.add(bookingId);
        }
        setExpandedRows(newExpanded);
    };

    // Tìm kiếm đặt bàn
    const handleSearch = () => {
        if (!search.trim()) {
            setFilteredBookings(bookings);
            setCurrentPage(1);
            return;
        }

        const searchLower = search.toLowerCase().trim();
        const filtered = bookings.filter(
            (booking) =>
                booking.fullName?.toLowerCase().includes(searchLower) ||
                booking.phoneNumber?.toLowerCase().includes(searchLower) ||
                booking.id?.toString().includes(searchLower) ||
                booking.status?.toLowerCase().includes(searchLower) ||
                formatArea(booking.area)?.toLowerCase().includes(searchLower)
        );
        setFilteredBookings(filtered);
        setCurrentPage(1);
    };

    // Xóa bộ lọc tìm kiếm
    const handleClearFilter = () => {
        setSearch('');
        setFilteredBookings(bookings);
        setCurrentPage(1);
    };

    // Filter bookings when search changes
    useEffect(() => {
        if (!search.trim()) {
            setFilteredBookings(bookings);
            setCurrentPage(1);
        } else {
            const searchLower = search.toLowerCase().trim();
            const filtered = bookings.filter(
                (booking) =>
                    booking.fullName?.toLowerCase().includes(searchLower) ||
                    booking.phoneNumber?.toLowerCase().includes(searchLower) ||
                    booking.id?.toString().includes(searchLower) ||
                    booking.status?.toLowerCase().includes(searchLower) ||
                    formatArea(booking.area)?.toLowerCase().includes(searchLower)
            );
            setFilteredBookings(filtered);
            setCurrentPage(1);
        }
    }, [search, bookings]);

    const handleConfirm = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận đơn đặt bàn',
            text: 'Bạn có chắc muốn xác nhận đơn đặt bàn này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedBooking = await confirmBooking(token, id);
            const updatedBookings = bookings.map((booking) => (booking.id === id ? updatedBooking : booking));
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);
            toast.success('Xác nhận đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi xác nhận đơn đặt bàn.', {
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

    const handleCancelByAdmin = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận hủy đơn đặt bàn',
            text: 'Bạn có chắc muốn hủy đơn đặt bàn này? Đơn sẽ chuyển sang trạng thái Đã hủy.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Hủy đơn',
            cancelButtonText: 'Thoát',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedBooking = await cancelBookingByAdmin(token, id);
            const updatedBookings = bookings.map((booking) => (booking.id === id ? updatedBooking : booking));
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);
            toast.success('Hủy đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi hủy đơn đặt bàn.', {
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

    const handleApproveCancel = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận yêu cầu hủy',
            text: 'Bạn có chắc muốn đồng ý với yêu cầu hủy đơn đặt bàn này? Đơn sẽ chuyển sang trạng thái Đã hủy.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedBooking = await approveCancelBooking(token, id);
            const updatedBookings = bookings.map((booking) => (booking.id === id ? updatedBooking : booking));
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);
            toast.success('Đồng ý yêu cầu hủy thành công! Đơn đã chuyển sang trạng thái Đã hủy.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi đồng ý yêu cầu hủy.', {
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

    const handleRejectCancel = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Từ chối yêu cầu hủy',
            text: 'Bạn có chắc muốn từ chối yêu cầu hủy đơn đặt bàn này? Đơn sẽ quay lại trạng thái Đã xác nhận.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Thoát',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedBooking = await rejectCancelBooking(token, id);
            const updatedBookings = bookings.map((booking) => (booking.id === id ? updatedBooking : booking));
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);
            toast.success('Từ chối yêu cầu hủy thành công! Đơn đã quay lại trạng thái Đã xác nhận.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
        } catch (err) {
            toast.error(err.message || 'Lỗi khi từ chối yêu cầu hủy.', {
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

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận xóa đơn đặt bàn',
            text: 'Bạn có chắc muốn xóa đơn đặt bàn này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            await deleteBooking(token, id);
            const updatedBookings = bookings.filter((booking) => booking.id !== id);
            setBookings(updatedBookings);
            setFilteredBookings(updatedBookings);
            toast.success('Xóa đơn đặt bàn thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            // Adjust current page if necessary
            if (currentBookings.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err) {
            toast.error(err.message || 'Lỗi khi xóa đơn đặt bàn.', {
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


    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'CANCELLED': return 'Đã hủy';
            case 'CANCEL_REQUESTED': return 'Yêu cầu hủy';
            default: return status || 'Không xác định';
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'CANCEL_REQUESTED': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Pagination logic
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">Quản Lý Đặt Bàn</h2>
                <div className="relative w-full md:w-64 lg:w-80">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base" />
                    <input
                        type="text"
                        className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm md:text-base"
                        placeholder="Tìm kiếm theo tên, số điện thoại, ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {search && (
                        <FaTimes
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500 transition-colors text-sm sm:text-base"
                            onClick={handleClearFilter}
                        />
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Card View for Mobile and Tablet */}
                <div className="lg:hidden">
                    {currentBookings.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 px-4">
                            {search ? 'Không tìm thấy đơn đặt bàn nào' : 'Không có đơn đặt bàn nào'}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {currentBookings.map((booking, idx) => {
                                const isExpanded = expandedRows.has(booking.id);
                                return (
                                    <div
                                        key={booking.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div
                                            className="flex items-start justify-between cursor-pointer"
                                            onClick={() => toggleRow(booking.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span className="text-xs text-gray-500">
                                                        #{idx + 1 + (currentPage - 1) * bookingsPerPage}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(booking.status)}`}>
                                                        {formatStatus(booking.status)}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {booking.fullName || 'N/A'}
                                                </h3>
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {booking.numberOfGuests} khách
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {booking.bookingDate ? `${format(new Date(booking.bookingDate), 'dd/MM/yyyy')} ${booking.bookingTime}` : 'Không xác định'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-2">
                                                {isExpanded ? (
                                                    <FaChevronUp className="text-indigo-600 text-sm" />
                                                ) : (
                                                    <FaChevronDown className="text-indigo-600 text-sm" />
                                                )}
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="text-sm font-bold text-gray-900 mb-3">Chi Tiết Đơn Đặt Bàn</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">ID:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {booking.id}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Họ Tên:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {booking.fullName || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số Điện Thoại:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {booking.phoneNumber || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Ngày Đặt:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {booking.bookingDate ? `${format(new Date(booking.bookingDate), 'dd/MM/yyyy')} ${booking.bookingTime}` : 'Không xác định'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số Khách:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {booking.numberOfGuests}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Khu Vực:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {formatArea(booking.area)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Yêu Cầu Đặc Biệt:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {booking.specialRequests || 'Không có'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Thời Gian Đặt:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {booking.createdAt ? format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        {booking.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleConfirm(booking.id)}
                                                                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaCheck className="inline mr-1" />
                                                                    Xác nhận
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelByAdmin(booking.id)}
                                                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaTimes className="inline mr-1" />
                                                                    Hủy
                                                                </button>
                                                            </>
                                                        )}
                                                        {booking.status === 'CANCEL_REQUESTED' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApproveCancel(booking.id)}
                                                                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaCheckCircle className="inline mr-1" />
                                                                    Đồng ý hủy
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectCancel(booking.id)}
                                                                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaBan className="inline mr-1" />
                                                                    Từ chối
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(booking.id)}
                                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs"
                                                        >
                                                            <FaTrash className="inline mr-1" />
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Table View for Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-indigo-100 text-indigo-900">
                                <th className="p-4 text-left font-semibold text-sm w-12"></th>
                                <th className="p-4 text-left font-semibold text-sm">#</th>
                                <th className="p-4 text-left font-semibold text-sm">Họ Tên</th>
                                <th className="p-4 text-left font-semibold text-sm">Ngày Đặt</th>
                                <th className="p-4 text-left font-semibold text-sm">Số Khách</th>
                                <th className="p-4 text-left font-semibold text-sm">Thời Gian Đặt</th>
                                <th className="p-4 text-left font-semibold text-sm">Trạng Thái</th>
                                <th className="p-4 text-left font-semibold text-sm">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500 py-6">
                                        {search ? 'Không tìm thấy đơn đặt bàn nào' : 'Không có đơn đặt bàn nào'}
                                    </td>
                                </tr>
                            ) : (
                                currentBookings.map((booking, index) => {
                                    const isExpanded = expandedRows.has(booking.id);
                                    return (
                                        <>
                                            <tr
                                                key={booking.id}
                                                className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                                                onClick={() => toggleRow(booking.id)}
                                            >
                                                <td className="p-4 border-t border-gray-200 text-center">
                                                    {isExpanded ? (
                                                        <FaChevronUp className="text-indigo-600 mx-auto" />
                                                    ) : (
                                                        <FaChevronDown className="text-indigo-600 mx-auto" />
                                                    )}
                                                </td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{index + 1 + (currentPage - 1) * bookingsPerPage}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{booking.fullName}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">
                                                    {booking.bookingDate ? `${format(new Date(booking.bookingDate), 'dd/MM/yyyy')} ${booking.bookingTime}` : 'Không xác định'}
                                                </td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{booking.numberOfGuests}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">
                                                    {booking.createdAt ? format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                </td>
                                                <td className="p-4 border-t border-gray-200">
                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(booking.status)}`}>
                                                        {formatStatus(booking.status)}
                                                    </span>
                                                </td>
                                                <td
                                                    className="p-4 border-t border-gray-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex space-x-2">
                                                        {booking.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleConfirm(booking.id)}
                                                                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                                                                    title="Xác nhận đơn đặt bàn"
                                                                >
                                                                    <FaCheck />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelByAdmin(booking.id)}
                                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                                    title="Hủy đơn đặt bàn"
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </>
                                                        )}
                                                        {booking.status === 'CANCEL_REQUESTED' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApproveCancel(booking.id)}
                                                                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                                                                    title="Đồng ý yêu cầu hủy"
                                                                >
                                                                    <FaCheckCircle />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectCancel(booking.id)}
                                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                                    title="Từ chối yêu cầu hủy"
                                                                >
                                                                    <FaBan />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(booking.id)}
                                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                            title="Xóa đơn đặt bàn"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr key={`${booking.id}-detail`}>
                                                    <td colSpan="8" className="p-0 bg-gray-50">
                                                        <div className="p-6 border-t border-gray-200">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết Đơn Đặt Bàn</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {booking.id}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ Tên:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {booking.fullName || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số Điện Thoại:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {booking.phoneNumber || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Đặt:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {booking.bookingDate ? `${format(new Date(booking.bookingDate), 'dd/MM/yyyy')} ${booking.bookingTime}` : 'Không xác định'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số Khách:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {booking.numberOfGuests}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Khu Vực:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {formatArea(booking.area)}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Yêu Cầu Đặc Biệt:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {booking.specialRequests || 'Không có'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời Gian Đặt:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {booking.createdAt ? format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái:</label>
                                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(booking.status)}`}>
                                                                        {formatStatus(booking.status)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredBookings.length > bookingsPerPage && (
                    <div className="flex flex-wrap justify-center items-center gap-2 py-4 px-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages).keys()].map((page) => (
                            <button
                                key={page + 1}
                                onClick={() => handlePageChange(page + 1)}
                                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${currentPage === page + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminBookingManagement;