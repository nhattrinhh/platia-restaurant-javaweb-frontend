import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Loader2, X } from 'lucide-react';

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
            <span className="font-medium flex-1">{message}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

function Header() {
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch profile when component mounts
    useEffect(() => {
        if (!token) {
            setToast({ message: 'Vui lòng đăng nhập để xem thông tin cá nhân.', type: 'error' });
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                    timeout: 5000,
                });
                setUser(response.data);
            } catch (error) {
                const status = error.response?.status;
                let errorMsg = 'Lỗi khi tải thông tin người dùng. Vui lòng thử lại.';
                if (status === 401) {
                    errorMsg = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setToast({ message: errorMsg, type: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate, token]);

    return (
        <>
            <header
                className="admin-header h-16 sticky top-0 z-50 bg-white border-b shadow-sm flex items-center justify-between px-4"
            >
                <div className="admin-header-left flex items-center gap-2">
                    <img
                        src="/images/logo0.png"
                        alt="Platia Logo"
                        className="h-10 w-10 object-contain"
                    />
                    <span className="text-2xl font-semibold text-indigo-900 tracking-tight">
                        Platia
                    </span>
                </div>

                <div className="admin-header-right flex items-center gap-4">
                    <div className="search-box hidden md:block">
                        <input
                            type="text"
                            className="form-control w-45 bg-gray-100 rounded-full p-2"
                            placeholder="Tìm kiếm..."
                            style={{ minWidth: 180 }}
                        />
                    </div>
                    <div className="relative flex items-center gap-2">
                        <span className="text-gray-500 font-semibold hidden md:inline">
                            Xin chào, {user?.fullname || 'Người dùng'}
                        </span>
                        <FaUserCircle
                            size={32}
                            className="text-primary cursor-pointer"
                            onClick={() => {
                                setShowMenu(!showMenu);
                            }}
                        />
                        {showMenu && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-100 w-48 z-50"
                            >
                                {/* No profile view button */}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

export default Header;