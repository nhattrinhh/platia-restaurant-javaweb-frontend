import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBooking } from '../../../services/api/bookingService';
import { validateBookingForm } from '../../../utils/formValidation';

function Booking() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    bookingDate: '',
    bookingTime: '',
    numberOfGuests: 1,
    area: 'indoor',
    specialRequests: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateBookingForm(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Vui lòng kiểm tra các trường thông tin.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Vui lòng đăng nhập để đặt bàn.');
      setLoading(false);
      return;
    }

    Swal.fire({
      title: 'Xác nhận đặt bàn',
      text: 'Bạn có chắc chắn muốn đặt bàn với thông tin này?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 hover:shadow-md transition ease-in-out duration-200',
        cancelButton: 'px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 hover:shadow-md transition ease-in-out duration-200',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createBooking(token, formData);

          toast.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ để xác nhận.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'light',
          });

          setFormData({
            fullName: '',
            phoneNumber: '',
            bookingDate: '',
            bookingTime: '',
            numberOfGuests: 1,
            area: 'indoor',
            specialRequests: '',
          });
          setFieldErrors({});
        } catch (err) {
          setError(err.message || 'Đã có lỗi xảy ra khi đặt bàn.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-8">
          {/* <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-1-1V8a1 1 0 011-1h5z" />
            </svg>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Restaurant Info & Offers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Khám Phá Platia</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="/images/about/img1.jpg"
                  alt="Restaurant Indoor"
                  className="w-full h-36 object-cover transform hover:scale-105 transition ease-in-out duration-300"
                />
                <p className="absolute bottom-2 left-2 text-white font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded">Khu vực trong nhà</p>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="/images/about/img2.jpg"
                  alt="Restaurant Outdoor"
                  className="w-full h-36 object-cover transform hover:scale-105 transition ease-in-out duration-300"
                />
                <p className="absolute bottom-2 left-2 text-white font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded">Khu vườn ngoài trời</p>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="/images/Product/pizza-pho-mai.jpg"
                  alt="Signature Dish"
                  className="w-full h-36 object-cover transform hover:scale-105 transition ease-in-out duration-300"
                />
                <p className="absolute bottom-2 left-2 text-white font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded">Món đặc trưng</p>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="/images/about/img3.jpg"
                  alt="Chef Team"
                  className="w-full h-36 object-cover transform hover:scale-105 transition ease-in-out duration-300"
                />
                <p className="absolute bottom-2 left-2 text-white font-medium text-sm bg-black bg-opacity-50 px-2 py-1 rounded">Đội ngũ đầu bếp</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Platia là điểm đến lý tưởng cho tín đồ ẩm thực, mang đến trải nghiệm tinh tế qua sự kết hợp hài hòa giữa các nền văn hóa ẩm thực thế giới. Chúng tôi sử dụng nguyên liệu tươi sạch, thân thiện môi trường để tạo ra món ăn vừa ngon miệng, vừa tốt cho sức khỏe. Không gian đa dạng – từ khu vực trong nhà hiện đại, vườn ngoài trời xanh mát, phòng VIP sang trọng đến sân thượng lãng mạn – mang lại những khoảnh khắc đáng nhớ bên người thân và bạn bè.
            </p>
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Điểm Nhấn Ẩm Thực</span>
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Món ăn đặc trưng theo mùa, được chế biến bởi đội ngũ đầu bếp tài hoa.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sự kiện ẩm thực độc quyền như “Đêm Ẩm Thực Quốc Tế” hàng tháng.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cam kết sử dụng nguyên liệu bền vững, hỗ trợ nông dân địa phương.</span>
                </li>
              </ul>
              <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
                <p className="text-gray-700 text-base">
                  Cần hỗ trợ? Gọi ngay: <span className="font-medium text-indigo-600">1900-1234</span>
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Thông Tin Đặt Bàn</h2>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-lg mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                    placeholder="Nhập họ và tên"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                    placeholder="Nhập số điện thoại"
                  />
                  {fieldErrors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày Đặt *
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    name="bookingDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.bookingDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                  />
                  {fieldErrors.bookingDate && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.bookingDate}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ Đặt *
                  </label>
                  <input
                    type="time"
                    id="bookingTime"
                    name="bookingTime"
                    required
                    value={formData.bookingTime}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.bookingTime ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                  />
                  {fieldErrors.bookingTime && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.bookingTime}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
                    Số Khách *
                  </label>
                  <input
                    type="number"
                    id="numberOfGuests"
                    name="numberOfGuests"
                    required
                    min="1"
                    max="50"
                    value={formData.numberOfGuests}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.numberOfGuests ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                  />
                  {fieldErrors.numberOfGuests && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.numberOfGuests}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Khu Vực *
                  </label>
                  <select
                    id="area"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.area ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                  >
                    <option value="indoor">Trong nhà</option>
                    <option value="vip">Phòng VIP</option>
                    <option value="outdoor">Khu vườn</option>
                    <option value="terrace">Sân thượng</option>
                  </select>
                  {fieldErrors.area && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.area}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu đặc biệt
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows="3"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 hover:border-indigo-400 hover:scale-[1.02] transition ease-in-out duration-200 ${fieldErrors.specialRequests ? 'border-red-500 focus:ring-red-500' : 'border-gray-400'}`}
                  placeholder="Ví dụ: Dị ứng thực phẩm, tổ chức sinh nhật, bàn gần cửa sổ..."
                />
                {fieldErrors.specialRequests && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.specialRequests}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 hover:shadow-md transition ease-in-out duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Đang gửi...' : 'Xác Nhận Đặt Bàn'}
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 hover:shadow-md transition ease-in-out duration-200 text-center"
                >
                  Hủy Bỏ
                </Link>
              </div>
              <p className="text-xs text-gray-500 flex items-center justify-center space-x-1 mt-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Thông tin đặt bàn được lưu dưới dạng văn bản</span>
              </p>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span>Ưu Đãi Đặc Biệt</span>
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Giảm 20% cho đặt bàn trước 48 giờ (T2-T5)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Tặng cocktail cho nhóm 6+ người</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Miễn phí trang trí bàn tiệc</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">*Ưu đãi áp dụng đến 31/12/2025</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>Lưu Ý *</span>
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Đến đúng giờ (muộn quá 15 phút có thể mất bàn)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Hủy bàn trước 24h (phòng VIP có phí phạt)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>Ghi rõ dị ứng thực phẩm và yêu cầu đặc biệt</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default Booking;