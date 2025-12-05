import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { FaHourglassHalf, FaCheckCircle, FaTruck, FaBoxOpen, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';
import { updateOrderStatus, updatePaymentStatus, updateDeliveryDate } from '../../../services/api/orderService';

function AdminOrderDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { order } = state || {};
    const token = localStorage.getItem('token');
    const [currentOrder, setCurrentOrder] = useState(order);

    if (!order) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">Không tìm thấy đơn hàng.</div>;
    }

    const handleUpdateStatuses = async () => {
        const currentOrderStatus = currentOrder?.orderStatus || 'CONFIRMED';
        const currentPaymentStatus = currentOrder?.paymentStatus || 'PENDING';

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
                updatedOrder = await updateOrderStatus(token, currentOrder.id, orderStatus);
                setCurrentOrder(updatedOrder);
                toast.success(`Cập nhật trạng thái đơn hàng thành ${formatStatus(orderStatus)} thành công!`);
            }
            if (paymentStatus !== currentPaymentStatus) {
                updatedOrder = await updatePaymentStatus(token, currentOrder.id, paymentStatus);
                setCurrentOrder(updatedOrder);
                toast.success(`Cập nhật trạng thái thanh toán thành ${formatPaymentStatus(paymentStatus)} thành công!`);
            }
        } catch (err) {
            toast.error(err.message || 'Cập nhật trạng thái không thành công.');
        }
    };

    const handleUpdateDeliveryDate = async () => {
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
            const updatedOrder = await updateDeliveryDate(token, currentOrder.id, deliveryDate);
            setCurrentOrder(updatedOrder);
            toast.success('Cập nhật thời gian giao hàng thành công!');
        } catch (err) {
            toast.error(err.message || 'Không thể cập nhật thời gian giao hàng.');
        }
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <FaHourglassHalf className="h-5 w-5 mr-2 text-yellow-600" />;
            case 'CONFIRMED': return <FaCheckCircle className="h-5 w-5 mr-2 text-blue-600" />;
            case 'SHIPPING': return <FaTruck className="h-5 w-5 mr-2 text-orange-600" />;
            case 'DELIVERED': return <FaBoxOpen className="h-5 w-5 mr-2 text-green-600" />;
            case 'CANCELLED': return <FaTimesCircle className="h-5 w-5 mr-2 text-red-600" />;
            case 'CANCEL_REQUESTED': return <FaQuestionCircle className="h-5 w-5 mr-2 text-purple-600" />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <ToastContainer />
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-indigo-100 text-indigo-900 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold tracking-tight">Chi Tiết Đơn Hàng</h1>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium"
                    >
                        Quay Lại
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Status with Icon */}
                    <div className="bg-indigo-50 p-5 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                            {getStatusIcon(currentOrder.orderStatus)}
                            Trạng Thái Đơn Hàng: {formatStatus(currentOrder.orderStatus)}
                        </h2>
                    </div>

                    {/* Order Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-indigo-900 mb-3">Thông Tin Khách Hàng</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><span className="font-medium text-gray-700">Họ Tên:</span> {currentOrder.fullname}</p>
                                <p><span className="font-medium text-gray-700">Email:</span> {currentOrder.email}</p>
                                <p><span className="font-medium text-gray-700">Số Điện Thoại:</span> {currentOrder.phoneNumber || 'Không có'}</p>
                                <p><span className="font-medium text-gray-700">Địa Chỉ Giao Hàng:</span> {currentOrder.deliveryAddress}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-indigo-900 mb-3">Thông Tin Đơn Hàng</h2>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p><span className="font-medium text-gray-700">Ngày Đặt Hàng:</span> {currentOrder.orderDate ? format(new Date(currentOrder.orderDate), 'dd/MM/yyyy HH:mm') : 'Không xác định'}</p>
                                <p><span className="font-medium text-gray-700">Ngày Giao Hàng:</span> {currentOrder.deliveryDate ? format(new Date(currentOrder.deliveryDate), 'dd/MM/yyyy HH:mm') : 'Chưa xác định'}</p>
                                <p>
                                    <span className="font-medium text-gray-700">Hình Thức Thanh Toán:</span>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${currentOrder.paymentMethod === 'CASH_ON_DELIVERY' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {formatPaymentMethod(currentOrder.paymentMethod)}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium text-gray-700">Trạng Thái Thanh Toán:</span>
                                    <span className={`ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${currentOrder.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        currentOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                            currentOrder.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {formatPaymentStatus(currentOrder.paymentStatus)}
                                    </span>
                                </p>
                                <p><span className="font-medium text-gray-700">Tổng Tiền:</span> {(currentOrder.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-indigo-900 p-5 border-b border-gray-200">Danh Sách Mặt Hàng</h2>
                        {currentOrder.orderItems && currentOrder.orderItems.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-indigo-50 text-indigo-900">
                                            <th className="p-4 text-left font-semibold text-sm">Tên Sản Phẩm</th>
                                            <th className="p-4 text-left font-semibold text-sm">Số Lượng</th>
                                            <th className="p-4 text-left font-semibold text-sm">Giá Đơn Vị</th>
                                            <th className="p-4 text-left font-semibold text-sm">Tổng Cộng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentOrder.orderItems.map((item, index) => (
                                            <tr key={item.id || `item-${index}`} className="hover:bg-gray-50 transition-all duration-200">
                                                <td className="p-4 border-t border-gray-200 text-sm">{item.productName || 'Không xác định'}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{item.quantity || 0}</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{(item.unitPrice || 0).toLocaleString('vi-VN')} VNĐ</td>
                                                <td className="p-4 border-t border-gray-200 text-sm">{(item.subtotal || 0).toLocaleString('vi-VN')} VNĐ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="p-5 text-gray-600 text-sm">Không có mặt hàng</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
                        <button
                            onClick={handleUpdateStatuses}
                            className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium flex items-center justify-center text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Cập Nhật Trạng Thái
                        </button>
                        <button
                            onClick={handleUpdateDeliveryDate}
                            className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 font-medium flex items-center justify-center text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 00-1-1H6zm12 7H2v7a2 2 0 002 2h12a2 2 0 002-2V9zM5 11a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                            </svg>
                            Cập Nhật Thời Gian Giao Hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminOrderDetail;