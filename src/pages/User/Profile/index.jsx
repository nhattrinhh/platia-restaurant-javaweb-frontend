import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Key, User, Mail, Phone, MapPin, ArrowLeft, Edit3, Save, CheckCircle, XCircle, X } from 'lucide-react';
import { getProfile, updateProfile } from '../../../services/api/userService';

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
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Custom Confirm Modal Component
function CustomConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
                <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Save className="w-6 h-6 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Xác nhận lưu thay đổi</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors duration-200"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}

function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [editForm, setEditForm] = useState({
        email: '',
        fullname: '',
        address: '',
        phoneNumber: '',
    });
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setToast({ message: 'Vui lòng đăng nhập để xem thông tin cá nhân.', type: 'error' });
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const userData = await getProfile(token);
                setUser(userData);
                setEditForm({
                    email: userData.email || '',
                    fullname: userData.fullname || '',
                    address: userData.address || '',
                    phoneNumber: userData.phoneNumber || '',
                });
            } catch (err) {
                console.error('Lỗi khi lấy thông tin profile:', err);
                if (err === 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.') {
                    setToast({ message: err, type: 'error' });
                    localStorage.removeItem('token');
                } else {
                    setToast({ message: err, type: 'error' });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const validateForm = () => {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editForm.email)) {
            errors.push('Email không hợp lệ.');
        }
        if (!editForm.fullname.trim()) {
            errors.push('Họ và tên không được để trống.');
        }
        if (editForm.phoneNumber && !/^\+?\d{8,15}$/.test(editForm.phoneNumber)) {
            errors.push('Số điện thoại không hợp lệ (8-15 chữ số).');
        }
        if (errors.length > 0) {
            setToast({ message: errors.join(' '), type: 'error' });
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        if (!user) {
            setToast({ message: 'Không tìm thấy thông tin người dùng.', type: 'error' });
            return;
        }

        setIsConfirmOpen(true); // Mở modal xác nhận
    };

    const handleConfirmUpdate = async () => {
        setIsConfirmOpen(false); // Đóng modal
        setUpdateLoading(true);
        try {
            await updateProfile(token, {
                username: user.username,
                email: editForm.email,
                fullname: editForm.fullname,
                address: editForm.address || '',
                phoneNumber: editForm.phoneNumber || '',
            });

            setUser((prev) => ({
                ...prev,
                email: editForm.email,
                fullname: editForm.fullname,
                address: editForm.address,
                phoneNumber: editForm.phoneNumber,
            }));

            setToast({ message: 'Cập nhật thông tin thành công! 🎉', type: 'success' });
        } catch (err) {
            console.error('Lỗi khi cập nhật profile:', err);
            if (err === 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.') {
                setToast({ message: err, type: 'error' });
                localStorage.removeItem('token');
            } else {
                setToast({ message: err, type: 'error' });
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex justify-center items-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                    <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <CustomConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                message="Bạn có chắc muốn lưu thay đổi?"
            />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Quay lại
                    </button>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Thông tin cá nhân</h1>
                    <p className="text-gray-600">Cập nhật thông tin của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                                {user && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.fullname || 'Chưa cập nhật'}</h2>
                                        <p className="text-gray-600 mb-4">@{user.username}</p>
                                        <div className="flex items-center justify-center text-gray-500 mb-2">
                                            <Mail className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{user.email}</span>
                                        </div>
                                        {user.phoneNumber && (
                                            <div className="flex items-center justify-center text-gray-500 mb-2">
                                                <Phone className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{user.phoneNumber}</span>
                                            </div>
                                        )}
                                        {user.address && (
                                            <div className="flex items-center justify-center text-gray-500">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{user.address}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <Link
                                    to="/change-password"
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Key className="w-5 h-5 mr-2" />
                                    Đổi mật khẩu
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center mb-8">
                                <Edit3 className="w-6 h-6 text-amber-500 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin</h2>
                            </div>

                            <div className="space-y-6">
                                {user && (
                                    <>
                                        {/* Username - Read Only */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                Tên đăng nhập
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                                                value={user.username}
                                                disabled
                                            />
                                        </div>

                                        {/* Full Name */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                Họ và tên <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                value={editForm.fullname}
                                                onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                                                placeholder="Nhập họ và tên của bạn"
                                                required
                                                disabled={updateLoading}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                                Email <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                placeholder="Nhập địa chỉ email"
                                                required
                                                disabled={updateLoading}
                                            />
                                        </div>

                                        {/* Phone Number */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                                                value={editForm.phoneNumber}
                                                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                                                placeholder="Nhập số điện thoại"
                                                disabled={updateLoading}
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="group">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                                Địa chỉ
                                            </label>
                                            <textarea
                                                className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                placeholder="Nhập địa chỉ của bạn"
                                                rows={3}
                                                disabled={updateLoading}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Save Button */}
                                <div className="pt-6">
                                    <button
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        onClick={handleUpdate}
                                        disabled={updateLoading || !user}
                                    >
                                        {updateLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5 mr-2" />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}

export default Profile;