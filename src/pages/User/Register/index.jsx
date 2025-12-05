import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../../../services/api/authService';
import { validateRegisterForm } from '../../../utils/formValidation';

function Register() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        address: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
        setSuccess('');
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateRegisterForm(formData);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        const registerData = {
            username: formData.username.trim(),
            email: formData.email.trim(),
            fullname: formData.fullname.trim(),
            address: formData.address.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password,
        };

        setLoading(true);
        try {
            await register(registerData);
            setSuccess('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const inputFields = [
        { id: 'fullname', label: 'Họ và tên', type: 'text', placeholder: 'Nhập họ và tên', required: true },
        { id: 'email', label: 'Email', type: 'email', placeholder: 'Nhập địa chỉ email', required: true },
        { id: 'username', label: 'Tên đăng nhập', type: 'text', placeholder: 'Nhập tên đăng nhập', required: true },
        { id: 'address', label: 'Địa chỉ', type: 'text', placeholder: 'Nhập địa chỉ', required: true },
        { id: 'phoneNumber', label: 'Số điện thoại', type: 'tel', placeholder: 'Nhập số điện thoại', required: true },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 py-8">
            <div className="bg-white/80 backdrop-blur-sm w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">R</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Tạo tài khoản
                    </h2>
                    <p className="text-gray-600">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Regular input fields */}
                    {inputFields.map(({ id, label, type, placeholder, required }) => (
                        <div key={id} className="space-y-2">
                            <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
                                {label}
                                {required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                                type={type}
                                id={id}
                                name={id}
                                value={formData[id]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white ${fieldErrors[id]
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            />
                            {fieldErrors[id] && (
                                <p className="text-red-500 text-sm mt-1 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠️</span>
                                    {fieldErrors[id]}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Password field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                            Mật khẩu
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white ${fieldErrors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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

                    {/* Confirm Password field */}
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                            Xác nhận mật khẩu
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu"
                                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white ${fieldErrors.confirmPassword
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1 flex items-center">
                                <span className="w-4 h-4 mr-1">⚠️</span>
                                {fieldErrors.confirmPassword}
                            </p>
                        )}
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
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 24 24"
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
                                Đang đăng ký...
                            </span>
                        ) : (
                            'Đăng ký'
                        )}
                    </button>
                </div>

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
                            aria-label="Đăng ký với Facebook"
                        >
                            <FaFacebookF size={20} />
                        </button>

                        <button
                            type="button"
                            className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-200 transform hover:scale-110 shadow-lg"
                            aria-label="Đăng ký với Twitter"
                        >
                            <FaTwitter size={20} />
                        </button>

                        <button
                            type="button"
                            className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-all duration-200 transform hover:scale-110 shadow-lg"
                            aria-label="Đăng ký với GitHub"
                        >
                            <FaGithub size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;