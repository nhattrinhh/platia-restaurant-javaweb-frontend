import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaGithub, FaEye, FaEyeSlash, FaUser, FaLock } from 'react-icons/fa';
import { login } from '../../services/api/authService';
import { validateLoginForm } from '../../utils/formValidation';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        setError('');
        setSuccess('');
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    // Helper function to decode JWT token
    const decodeJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return { roles: [] }; // Fallback if decoding fails
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateLoginForm(formData);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await login({
                username: formData.username.trim(),
                password: formData.password.trim(),
            });

            const token = response.token;
            if (!token) {
                throw new Error('Không nhận được token');
            }
            localStorage.setItem('token', token);

            const decodedToken = decodeJwt(token);
            const roles = decodedToken?.roles || [];

            setSuccess('Đăng nhập thành công!');
            setTimeout(() => {
                if (roles.includes('ADMIN')) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }, 1000);
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-8">
            <div className="bg-white/80 backdrop-blur-sm w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FaUser className="text-white text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Chào mừng trở lại
                    </h2>
                    <p className="text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username field */}
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                            Tên đăng nhập
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập"
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white ${fieldErrors.username
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                disabled={loading}
                            />
                        </div>
                        {fieldErrors.username && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <span className="w-4 h-4 mr-1">⚠️</span>
                                {fieldErrors.username}
                            </p>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Mật khẩu
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white ${fieldErrors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={loading}
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {fieldErrors.password && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <span className="w-4 h-4 mr-1">⚠️</span>
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {/* Remember me & Forgot password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                disabled={loading}
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 font-medium">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Global error/success messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                            {success}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </form>

                {/* Social login */}
                <div className="mt-8">
                    <div className="flex items-center">
                        <hr className="flex-grow border-t border-gray-300" />
                        <span className="mx-4 text-gray-500 text-sm font-medium">hoặc tiếp tục với</span>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            type="button"
                            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-200 transform hover:scale-110 shadow-lg"
                            aria-label="Đăng nhập với Facebook"
                        >
                            <FaFacebook size={20} />
                        </button>

                        <button
                            type="button"
                            className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-200 transform hover:scale-110 shadow-lg"
                            aria-label="Đăng nhập với Twitter"
                        >
                            <FaTwitter size={20} />
                        </button>

                        <button
                            type="button"
                            className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 transform hover:scale-110 shadow-lg"
                            aria-label="Đăng nhập với GitHub"
                        >
                            <FaGithub size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;