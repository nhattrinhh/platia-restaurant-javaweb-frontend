import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCheck, FaEye, FaTimes, FaCheckCircle, FaBan, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus, cancelOrder, approveCancelOrder, rejectCancelOrder, deleteOrder, updateDeliveryDate } from '../../../services/api/orderService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function AdminOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách đơn hàng.');
                toast.error(err.message || 'Không thể tải danh sách đơn hàng.');
            }
        };

        fetchOrders();
    }, [token]);

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
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
                setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
                toast.success(`Cập nhật trạng thái đơn hàng thành ${formatStatus(orderStatus)} thành công!`);
            }
            if (paymentStatus !== currentPaymentStatus) {
                updatedOrder = await updatePaymentStatus(token, id, paymentStatus);
                setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
            setOrders(orders.map((order) => (order.id === id ? updatedOrder : order)));
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
            setOrders(orders.filter((order) => (order.id !== id)));
            toast.success('Xóa đơn hàng thành công!');
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
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Quản Lý Đơn Hàng</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-indigo-100 text-indigo-900">
                                <th className="p-4 text-left font-semibold">#</th>
                                <th className="p-4 text-left font-semibold">Họ Tên</th>
                                <th className="p-4 text-left font-semibold">Địa Chỉ Giao</th>
                                <th className="p-4 text-left font-semibold">Ngày Đặt</th>
                                <th className="p-4 text-left font-semibold">Ngày Giao</th>
                                <th className="p-4 text-left font-semibold">Tổng Tiền</th>
                                <th className="p-4 text-left font-semibold">Trạng Thái</th>
                                <th className="p-4 text-left font-semibold">Thanh Toán</th>
                                <th className="p-4 text-left font-semibold">Hình Thức Thanh Toán</th>
                                <th className="p-4 text-left font-semibold">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="text-center text-gray-500 py-6">
                                        Không có đơn hàng nào.
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-all duration-200">
                                        <td className="p-4 border-t border-gray-200">{index + 1 + (currentPage - 1) * ordersPerPage}</td>
                                        <td className="p-4 border-t border-gray-200">{order.fullname}</td>
                                        <td className="p-4 border-t border-gray-200">{order.deliveryAddress}</td>
                                        <td className="p-4 border-t border-gray-200">
                                            {order.orderDate ? format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
                                            {order.deliveryDate ? format(new Date(order.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'}
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
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
                                        <td className="p-4 border-t border-gray-200">
                                            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${order.paymentMethod === 'CASH_ON_DELIVERY' ? 'bg-green-100 text-green-800' :
                                                'bg-blue-100 text-blue-800'
                                                }`}>
                                                {formatPaymentMethod(order.paymentMethod)}
                                            </span>
                                        </td>
                                        <td className="p-4 border-t border-gray-200">
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.length > ordersPerPage && (
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
            </div>
        </div>
    );
}

export default AdminOrderManagement;