import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCheck, FaEye, FaTimes, FaCheckCircle, FaBan, FaTrash, FaEdit, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus, cancelOrder, approveCancelOrder, rejectCancelOrder, deleteOrder, updateDeliveryDate } from '../../../services/api/orderService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function AdminOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 7; // 7 records per page
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setError('Vui lòng đăng nhập với vai trò admin để quản lý đơn hàng.');
                setLoading(false);
                return;
            }

            try {
                const orderData = await getAdminOrders(token);
                setOrders(orderData);
                setFilteredOrders(orderData);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách đơn hàng.');
                toast.error(err.message || 'Không thể tải danh sách đơn hàng.');
            }
        };

        fetchOrders();
    }, [token]);

    // Toggle expand row
    const toggleRow = (orderId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(orderId)) {
            newExpanded.delete(orderId);
        } else {
            newExpanded.add(orderId);
        }
        setExpandedRows(newExpanded);
    };

    // Tìm kiếm đơn hàng
    const handleSearch = () => {
        if (!search.trim()) {
            setFilteredOrders(orders);
            setCurrentPage(1);
            return;
        }

        const searchLower = search.toLowerCase().trim();
        const filtered = orders.filter(
            (order) =>
                order.fullname?.toLowerCase().includes(searchLower) ||
                order.deliveryAddress?.toLowerCase().includes(searchLower) ||
                order.id?.toString().includes(searchLower) ||
                order.orderStatus?.toLowerCase().includes(searchLower) ||
                order.paymentStatus?.toLowerCase().includes(searchLower) ||
                order.totalAmount?.toString().includes(searchLower)
        );
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    // Xóa bộ lọc tìm kiếm
    const handleClearFilter = () => {
        setSearch('');
        setFilteredOrders(orders);
        setCurrentPage(1);
    };

    // Filter orders when search changes
    useEffect(() => {
        if (!search.trim()) {
            setFilteredOrders(orders);
            setCurrentPage(1);
        } else {
            const searchLower = search.toLowerCase().trim();
            const filtered = orders.filter(
                (order) =>
                    order.fullname?.toLowerCase().includes(searchLower) ||
                    order.deliveryAddress?.toLowerCase().includes(searchLower) ||
                    order.id?.toString().includes(searchLower) ||
                    order.orderStatus?.toLowerCase().includes(searchLower) ||
                    order.paymentStatus?.toLowerCase().includes(searchLower) ||
                    order.totalAmount?.toString().includes(searchLower)
            );
            setFilteredOrders(filtered);
            setCurrentPage(1);
        }
    }, [search, orders]);

    const handleConfirmOrder = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận đơn hàng',
            text: 'Bạn có chắc muốn xác nhận đơn hàng này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await updateOrderStatus(token, id, 'CONFIRMED');
            const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Xác nhận đơn hàng thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể xác nhận đơn hàng.');
        }
    };

    const handleCancelOrder = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Hủy đơn hàng',
            text: 'Bạn có chắc muốn hủy đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Hủy đơn hàng',
            cancelButtonText: 'Thoát',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await updateOrderStatus(token, id, 'CANCELLED');
            const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Hủy đơn hàng thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể hủy đơn hàng.');
        }
    };

    const handleUpdateStatuses = async (id) => {
        const order = orders.find((o) => o.id === id);
        const currentOrderStatus = order?.orderStatus || 'CONFIRMED';
        const currentPaymentStatus = order?.paymentStatus || 'PENDING';

        const { value } = await Swal.fire({
            title: 'Cập nhật trạng thái',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng:</label>
                        <select id="orderStatus" class="w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                            <option value="CONFIRMED" ${currentOrderStatus === 'CONFIRMED' ? 'selected' : ''}>Đã xác nhận</option>
                            <option value="SHIPPING" ${currentOrderStatus === 'SHIPPING' ? 'selected' : ''}>Đang giao hàng</option>
                            <option value="DELIVERED" ${currentOrderStatus === 'DELIVERED' ? 'selected' : ''}>Đã giao</option>
                            <option value="CANCELLED" ${currentOrderStatus === 'CANCELLED' ? 'selected' : ''}>Đã hủy</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái thanh toán:</label>
                        <select id="paymentStatus" class="w-full p-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                            <option value="PENDING" ${currentPaymentStatus === 'PENDING' ? 'selected' : ''}>Chờ thanh toán</option>
                            <option value="PAID" ${currentPaymentStatus === 'PAID' ? 'selected' : ''}>Đã thanh toán</option>
                            <option value="FAILED" ${currentPaymentStatus === 'FAILED' ? 'selected' : ''}>Thanh toán thất bại</option>
                            <option value="REFUNDED" ${currentPaymentStatus === 'REFUNDED' ? 'selected' : ''}>Đã hoàn tiền</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            preConfirm: () => {
                const orderStatus = document.getElementById('orderStatus').value;
                const paymentStatus = document.getElementById('paymentStatus').value;
                if (!orderStatus || !paymentStatus) {
                    Swal.showValidationMessage('Vui lòng chọn cả hai trạng thái!');
                    return false;
                }
                return { orderStatus, paymentStatus };
            }
        });

        if (!value) return;

        const { orderStatus, paymentStatus } = value;

        try {
            let updatedOrder = null;
            if (orderStatus !== currentOrderStatus) {
                updatedOrder = await updateOrderStatus(token, id, orderStatus);
                const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
                setOrders(updatedOrders);
                setFilteredOrders(updatedOrders);
                toast.success(`Cập nhật trạng thái đơn hàng thành ${formatStatus(orderStatus)} thành công!`);
            }
            if (paymentStatus !== currentPaymentStatus) {
                updatedOrder = await updatePaymentStatus(token, id, paymentStatus);
                const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
                setOrders(updatedOrders);
                setFilteredOrders(updatedOrders);
                toast.success(`Cập nhật trạng thái thanh toán thành ${formatPaymentStatus(paymentStatus)} thành công!`);
            }
        } catch (err) {
            toast.error(err.message || 'Cập nhật trạng thái không thành công.');
        }
    };

    const handleUpdateDeliveryDate = async (id) => {
        const { value: deliveryDate } = await Swal.fire({
            title: 'Cập nhật thời gian giao hàng',
            input: 'datetime-local',
            inputLabel: 'Chọn thời gian giao hàng',
            inputPlaceholder: 'Chọn ngày và giờ',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng chọn thời gian giao hàng!';
                }
                const selectedDate = new Date(value);
                const now = new Date();
                if (selectedDate < now) {
                    return 'Thời gian giao hàng không được nhỏ hơn thời gian hiện tại!';
                }
                return null;
            },
        });

        if (!deliveryDate) return;

        try {
            const updatedOrder = await updateDeliveryDate(token, id, deliveryDate);
            const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Cập nhật thời gian giao hàng thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể cập nhật thời gian giao hàng.');
        }
    };

    const handleCancel = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận yêu cầu hủy',
            text: 'Bạn có chắc muốn yêu cầu hủy đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yêu cầu hủy',
            cancelButtonText: 'Thoát',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await cancelOrder(token, id);
            const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Yêu cầu hủy đơn hàng thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể yêu cầu hủy đơn hàng.');
        }
    };

    const handleApproveCancel = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận yêu cầu hủy',
            text: 'Bạn có chắc muốn đồng ý yêu cầu hủy đơn hàng này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await approveCancelOrder(token, id);
            const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Đồng ý yêu cầu hủy thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể đồng ý yêu cầu hủy.');
        }
    };

    const handleRejectCancel = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Từ chối yêu cầu hủy',
            text: 'Bạn có chắc muốn từ chối yêu cầu hủy đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Thoát',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            const updatedOrder = await rejectCancelOrder(token, id);
            const updatedOrders = orders.map((order) => (order.id === id ? updatedOrder : order));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Từ chối yêu cầu hủy thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể từ chối yêu cầu hủy.');
        }
    };

    const handleDelete = async (id) => {
        const confirmResult = await Swal.fire({
            title: 'Xác nhận xóa đơn hàng',
            text: 'Bạn có chắc muốn xóa đơn hàng này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            await deleteOrder(token, id);
            const updatedOrders = orders.filter((order) => (order.id !== id));
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
            toast.success('Xóa đơn hàng thành công!');
            // Adjust current page if necessary
            if (currentOrders.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err) {
            toast.error(err.message || 'Không thể xóa đơn hàng.');
        }
    };

    const handleViewDetails = (order) => {
        navigate(`/admin/orders/${order.id}`, { state: { order } });
    };

    const formatStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ xác nhận';
            case 'CONFIRMED': return 'Đã xác nhận';
            case 'SHIPPING': return 'Đang giao hàng';
            case 'DELIVERED': return 'Đã giao';
            case 'CANCELLED': return 'Đã hủy';
            case 'CANCEL_REQUESTED': return 'Yêu cầu hủy';
            default: return status || 'Không xác định';
        }
    };

    const formatPaymentStatus = (status) => {
        switch (status) {
            case 'PENDING': return 'Chờ thanh toán';
            case 'PAID': return 'Đã thanh toán';
            case 'FAILED': return 'Thanh toán thất bại';
            case 'REFUNDED': return 'Đã hoàn tiền';
            default: return status || 'Không xác định';
        }
    };

    const formatPaymentMethod = (method) => {
        switch (method) {
            case 'CASH_ON_DELIVERY': return 'Thanh toán khi nhận hàng';
            case 'ONLINE_PAYMENT': return 'Thanh toán trực tuyến';
            default: return method || 'Không xác định';
        }
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">Quản Lý Đơn Hàng</h2>
                <div className="relative w-full md:w-64 lg:w-80">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base" />
                    <input
                        type="text"
                        className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-xs sm:text-sm md:text-base"
                        placeholder="Tìm kiếm theo tên, địa chỉ, ID..."
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
                    {currentOrders.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 px-4">
                            {search ? 'Không tìm thấy đơn hàng nào' : 'Không có đơn hàng nào'}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {currentOrders.map((order, idx) => {
                                const isExpanded = expandedRows.has(order.id);
                                return (
                                    <div
                                        key={order.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div
                                            className="flex items-start justify-between cursor-pointer"
                                            onClick={() => toggleRow(order.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span className="text-xs text-gray-500">
                                                        #{idx + 1 + (currentPage - 1) * ordersPerPage}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                                        order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                        order.orderStatus === 'SHIPPING' ? 'bg-orange-100 text-orange-800' :
                                                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        order.orderStatus === 'CANCEL_REQUESTED' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {formatStatus(order.orderStatus)}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                                                        order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                        order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {formatPaymentStatus(order.paymentStatus)}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                    {order.fullname || 'N/A'}
                                                </h3>
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-2">
                                                <button
                                                    className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetails(order);
                                                    }}
                                                    title="Xem chi tiết"
                                                >
                                                    <FaEye className="text-xs" />
                                                </button>
                                                {isExpanded ? (
                                                    <FaChevronUp className="text-indigo-600 text-sm" />
                                                ) : (
                                                    <FaChevronDown className="text-indigo-600 text-sm" />
                                                )}
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <h4 className="text-sm font-bold text-gray-900 mb-3">Chi Tiết Đơn Hàng</h4>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">ID Đơn Hàng:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {order.id}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Họ Tên:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {order.fullname || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Địa Chỉ Giao:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 break-words">
                                                            {order.deliveryAddress || 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Ngày Đặt:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Ngày Giao:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tổng Tiền:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Hình Thức Thanh Toán:</label>
                                                        <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                                                            {formatPaymentMethod(order.paymentMethod)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <div className="flex flex-wrap gap-2">
                                                        {order.orderStatus === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleConfirmOrder(order.id)}
                                                                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaCheck className="inline mr-1" />
                                                                    Xác nhận
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelOrder(order.id)}
                                                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaTimes className="inline mr-1" />
                                                                    Hủy
                                                                </button>
                                                            </>
                                                        )}
                                                        {order.orderStatus === 'CANCEL_REQUESTED' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApproveCancel(order.id)}
                                                                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaCheckCircle className="inline mr-1" />
                                                                    Đồng ý hủy
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectCancel(order.id)}
                                                                    className="px-3 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaBan className="inline mr-1" />
                                                                    Từ chối
                                                                </button>
                                                            </>
                                                        )}
                                                        {order.orderStatus === 'CANCELLED' && (
                                                            <button
                                                                onClick={() => handleDelete(order.id)}
                                                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-xs"
                                                            >
                                                                <FaTrash className="inline mr-1" />
                                                                Xóa
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'CANCEL_REQUESTED' && order.orderStatus !== 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatuses(order.id)}
                                                                    className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <FaEdit className="inline mr-1" />
                                                                    Sửa trạng thái
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateDeliveryDate(order.id)}
                                                                    className="px-3 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-xs"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm12 7H2v7a2 2 0 002 2h12a2 2 0 002-2V9zM5 11a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                                                    </svg>
                                                                    Cập nhật ngày giao
                                                                </button>
                                                            </>
                                                        )}
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
                                <th className="p-4 text-left font-semibold text-sm">Địa Chỉ Giao</th>
                                <th className="p-4 text-left font-semibold text-sm">Ngày Đặt</th>
                                <th className="p-4 text-left font-semibold text-sm">Tổng Tiền</th>
                                <th className="p-4 text-left font-semibold text-sm">Trạng Thái</th>
                                <th className="p-4 text-left font-semibold text-sm">Thanh Toán</th>
                                <th className="p-4 text-left font-semibold text-sm">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center text-gray-500 py-6">
                                        {search ? 'Không tìm thấy đơn hàng nào' : 'Không có đơn hàng nào'}
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map((order, index) => {
                                    const isExpanded = expandedRows.has(order.id);
                                    return (
                                        <>
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                                                onClick={() => toggleRow(order.id)}
                                            >
                                                <td className="p-4 border-t border-gray-200 text-center">
                                                    {isExpanded ? (
                                                        <FaChevronUp className="text-indigo-600 mx-auto" />
                                                    ) : (
                                                        <FaChevronDown className="text-indigo-600 mx-auto" />
                                                    )}
                                                </td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{order.fullname}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm break-words">{order.deliveryAddress}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">
                                                    {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                </td>
                                                <td className="p-4 border-t border-gray-200 text-sm">
                                                    {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                                </td>
                                                <td className="p-4 border-t border-gray-200">
                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                            order.orderStatus === 'SHIPPING' ? 'bg-orange-100 text-orange-800' :
                                                                order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                    order.orderStatus === 'CANCEL_REQUESTED' ? 'bg-purple-100 text-purple-800' :
                                                                        'bg-red-100 text-red-800'
                                                        }`}>
                                                        {formatStatus(order.orderStatus)}
                                                    </span>
                                                </td>
                                                <td className="p-4 border-t border-gray-200">
                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                            order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {formatPaymentStatus(order.paymentStatus)}
                                                    </span>
                                                </td>
                                                <td
                                                    className="p-4 border-t border-gray-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleViewDetails(order)}
                                                            className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-200"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        {order.orderStatus === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleConfirmOrder(order.id)}
                                                                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200"
                                                                    title="Xác nhận đơn hàng"
                                                                >
                                                                    <FaCheck />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCancelOrder(order.id)}
                                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                                    title="Hủy đơn hàng"
                                                                >
                                                                    <FaTimes />
                                                                </button>
                                                            </>
                                                        )}
                                                        {order.orderStatus === 'CANCEL_REQUESTED' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApproveCancel(order.id)}
                                                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200"
                                                                    title="Đồng ý hủy"
                                                                >
                                                                    <FaCheckCircle />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectCancel(order.id)}
                                                                    className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-200"
                                                                    title="Từ chối hủy"
                                                                >
                                                                    <FaBan />
                                                                </button>
                                                            </>
                                                        )}
                                                        {order.orderStatus === 'CANCELLED' && (
                                                            <button
                                                                onClick={() => handleDelete(order.id)}
                                                                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                                                title="Xóa đơn hàng"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                        {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'CANCEL_REQUESTED' && order.orderStatus !== 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleUpdateStatuses(order.id)}
                                                                    className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-200"
                                                                    title="Sửa trạng thái đơn hàng và thanh toán"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleUpdateDeliveryDate(order.id)}
                                                                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all duration-200"
                                                                    title="Cập nhật thời gian giao hàng"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm12 7H2v7a2 2 0 002 2h12a2 2 0 002-2V9zM5 11a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr key={`${order.id}-detail`}>
                                                    <td colSpan="9" className="p-0 bg-gray-50">
                                                        <div className="p-6 border-t border-gray-200">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết Đơn Hàng</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Đơn Hàng:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {order.id}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ Tên:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {order.fullname || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa Chỉ Giao:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200 break-words">
                                                                        {order.deliveryAddress || 'N/A'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Đặt:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Giao:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổng Tiền:</label>
                                                                    <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                                                                        {(order.totalAmount || 0).toLocaleString('vi-VN')} VNĐ
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái Đơn Hàng:</label>
                                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                        order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                                                            order.orderStatus === 'SHIPPING' ? 'bg-orange-100 text-orange-800' :
                                                                                order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                                    order.orderStatus === 'CANCEL_REQUESTED' ? 'bg-purple-100 text-purple-800' :
                                                                                        'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {formatStatus(order.orderStatus)}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng Thái Thanh Toán:</label>
                                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                        order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                                            order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                                                'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                        {formatPaymentStatus(order.paymentStatus)}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình Thức Thanh Toán:</label>
                                                                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.paymentMethod === 'CASH_ON_DELIVERY' ? 'bg-green-100 text-green-800' :
                                                                        'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                        {formatPaymentMethod(order.paymentMethod)}
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
                {filteredOrders.length > ordersPerPage && (
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

export default AdminOrderManagement;