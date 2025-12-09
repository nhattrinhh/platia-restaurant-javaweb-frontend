import { useEffect, useState } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import { searchNews, createNews, updateNews, deleteNews } from '../../../services/api/newsService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function NewsManager() {
    const [newsList, setNewsList] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
    const [selectedNews, setSelectedNews] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
    });
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageToShow, setImageToShow] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const baseImagePath = 'http://localhost:5173/images/News/';

    // Lấy danh sách tin tức từ backend
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsData = await searchNews(token, '');
                const enrichedNews = newsData.map(news => ({
                    id: news.id,
                    title: news.title,
                    description: news.description || '',
                    imageUrl: news.imageUrl || '/images/News/placeholder.jpg',
                    timestamp: news.timestamp,
                }));
                setNewsList(enrichedNews);
                setError(null);
            } catch (err) {
                setError(err.message || 'Không thể tải danh sách tin tức.');
                toast.error(err.message || 'Không thể tải danh sách tin tức.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [token]);

    // Mở modal thêm/chỉnh sửa
    const handleOpenModal = (type, news = null) => {
        setModalType(type);
        setSelectedNews(news);
        if (type === 'edit' && news) {
            setForm({
                title: news.title,
                description: news.description || '',
                imageUrl: news.imageUrl && news.imageUrl.startsWith(baseImagePath) ? news.imageUrl.replace(baseImagePath, '') : news.imageUrl,
            });
        } else {
            setForm({
                title: '',
                description: '',
                imageUrl: '',
            });
        }
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedNews(null);
        setError(null);
    };

    // Xử lý thay đổi form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Mở modal xem ảnh lớn
    const handleShowImage = (imageUrl) => {
        setImageToShow(imageUrl || '/images/News/placeholder.jpg');
        setShowImageModal(true);
    };

    // Đóng modal xem ảnh
    const handleCloseImageModal = () => {
        setShowImageModal(false);
        setImageToShow(null);
    };

    // Thêm hoặc chỉnh sửa tin tức
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || form.title.trim() === '') {
            setError('Tiêu đề tin tức không được để trống.');
            toast.error('Tiêu đề tin tức không được để trống.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            return;
        }
        const imageUrl = form.imageUrl ? (form.imageUrl.startsWith('http') ? form.imageUrl : `${baseImagePath}${form.imageUrl}`) : null;
        if (imageUrl && imageUrl.startsWith('http') && !isValidUrl(imageUrl)) {
            setError('URL hình ảnh không hợp lệ.');
            toast.error('URL hình ảnh không hợp lệ.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            return;
        }
        if (imageUrl && !imageUrl.startsWith('http') && !form.imageUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
            setError('Tên tệp hình ảnh phải có đuôi .jpg, .jpeg, .png hoặc .gif.');
            toast.error('Tên tệp hình ảnh phải có đuôi .jpg, .jpeg, .png hoặc .gif.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            return;
        }

        try {
            const payload = {
                title: form.title,
                description: form.description || null,
                imageUrl: imageUrl,
            };

            if (modalType === 'add') {
                const newNews = await createNews(token, payload);
                setNewsList([...newsList, {
                    id: newNews.id,
                    title: newNews.title,
                    description: newNews.description || '',
                    imageUrl: newNews.imageUrl || '/images/News/placeholder.jpg',
                    timestamp: newNews.timestamp,
                }]);
                toast.success('Thêm tin tức thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
            } else if (modalType === 'edit' && selectedNews) {
                const updatedNews = await updateNews(token, selectedNews.id, payload);
                setNewsList(newsList.map(n =>
                    n.id === selectedNews.id ? {
                        ...n,
                        title: updatedNews.title,
                        description: updatedNews.description || '',
                        imageUrl: updatedNews.imageUrl || '/images/News/placeholder.jpg',
                        timestamp: updatedNews.timestamp,
                    } : n
                ));
                toast.success('Cập nhật tin tức thành công!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                });
            }
            handleCloseModal();
        } catch (err) {
            setError(err.message || 'Lỗi khi lưu tin tức.');
            toast.error(err.message || 'Lỗi khi lưu tin tức.', {
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

    // Xóa tin tức
    const handleDelete = async (id) => {
        if (!token) {
            setError('Vui lòng đăng nhập để thực hiện hành động này.');
            toast.error('Vui lòng đăng nhập để thực hiện hành động này.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Xác nhận xóa tin tức',
            text: 'Bạn có chắc chắn muốn xóa tin tức này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (!confirmResult.isConfirmed) return;

        try {
            await deleteNews(token, id);
            setNewsList(newsList.filter(n => n.id !== id));
            toast.success('Xóa tin tức thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            setError(null);
        } catch (err) {
            setError(err.message || 'Lỗi khi xóa tin tức.');
            toast.error(err.message || 'Lỗi khi xóa tin tức.', {
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

    // Tìm kiếm tin tức theo tiêu đề
    const handleSearch = async () => {
        try {
            const newsData = await searchNews(token, search);
            const enrichedNews = newsData.map(news => ({
                id: news.id,
                title: news.title,
                description: news.description || '',
                imageUrl: news.imageUrl || '/images/News/placeholder.jpg',
                timestamp: news.timestamp,
            }));
            setNewsList(enrichedNews);
            toast.success('Tìm kiếm tin tức thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            setError(null);
        } catch (err) {
            setError(err.message || 'Lỗi khi tìm kiếm tin tức.');
            toast.error(err.message || 'Lỗi khi tìm kiếm tin tức.', {
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

    // Xóa bộ lọc tìm kiếm và tải lại danh sách tin tức
    const handleClearFilter = async () => {
        setSearch('');
        try {
            const newsData = await searchNews(token, '');
            const enrichedNews = newsData.map(news => ({
                id: news.id,
                title: news.title,
                description: news.description || '',
                imageUrl: news.imageUrl || '/images/News/placeholder.jpg',
                timestamp: news.timestamp,
            }));
            setNewsList(enrichedNews);
            toast.success('Xóa bộ lọc thành công!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            });
            setError(null);
        } catch (err) {
            setError(err.message || 'Lỗi khi tải lại danh sách tin tức.');
            toast.error(err.message || 'Lỗi khi tải lại danh sách tin tức.', {
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

    // Kiểm tra URL hợp lệ
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Đang tải...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <p className="text-red-600 text-lg font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <ToastContainer />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                                Quản Lý Tin Tức
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600">
                                Quản lý và cập nhật thông tin tin tức của nhà hàng
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 sm:flex-initial sm:w-64 lg:w-80">
                                <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                                <input
                                    type="text"
                                    className="w-full pl-9 sm:pl-11 pr-9 sm:pr-11 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base shadow-sm"
                                    placeholder="Tìm kiếm theo tiêu đề..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                {search && (
                                    <button
                                        onClick={handleClearFilter}
                                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Xóa tìm kiếm"
                                    >
                                        <FaTimes className="text-sm sm:text-base" />
                                    </button>
                                )}
                            </div>
                            <button
                                className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm sm:text-base whitespace-nowrap"
                                onClick={() => handleOpenModal('add')}
                            >
                                <FaPlus className="mr-2 text-sm sm:text-base" /> 
                                <span className="hidden sm:inline">Thêm tin tức</span>
                                <span className="sm:hidden">Thêm mới</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* News List */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {newsList.length === 0 ? (
                        <div className="text-center py-12 sm:py-16">
                            <div className="text-gray-400 text-5xl sm:text-6xl mb-4">📰</div>
                            <p className="text-gray-500 text-base sm:text-lg font-medium">
                                Không có tin tức phù hợp
                            </p>
                            <p className="text-gray-400 text-sm sm:text-base mt-2">
                                Hãy thêm tin tức mới để bắt đầu
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {newsList.map((news, idx) => (
                                <details
                                    key={news.id}
                                    className="group transition-all duration-200 hover:bg-gray-50"
                                >
                                    <summary className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 cursor-pointer select-none gap-3 sm:gap-4">
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                            <span className="flex-shrink-0 font-bold text-indigo-600 text-base sm:text-lg">
                                                {idx + 1}.
                                            </span>
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={news.imageUrl}
                                                    alt={news.title}
                                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shadow-sm"
                                                    onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 line-clamp-2">
                                                    {news.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                                                    {new Date(news.timestamp).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0">
                                            <span className="text-xs text-gray-500 sm:hidden">
                                                {new Date(news.timestamp).toLocaleDateString('vi-VN')}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="p-2 sm:p-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', news); }}
                                                    title="Chỉnh sửa"
                                                    aria-label="Chỉnh sửa"
                                                >
                                                    <FaEdit className="text-xs sm:text-sm" />
                                                </button>
                                                <button
                                                    className="p-2 sm:p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(news.id); }}
                                                    title="Xóa"
                                                    aria-label="Xóa"
                                                >
                                                    <FaTrash className="text-xs sm:text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </summary>

                                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-2 sm:pt-4 bg-gray-50">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                                    <span className="font-semibold text-gray-900">Mô tả:</span>{' '}
                                                    {news.description || <span className="text-gray-400 italic">Không có mô tả.</span>}
                                                </p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <span className="font-semibold text-gray-900 text-sm sm:text-base">Hình ảnh:</span>
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={news.imageUrl}
                                                        alt={news.title}
                                                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow border-2 border-gray-200 hover:border-indigo-300"
                                                        onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                                        onClick={() => handleShowImage(news.imageUrl)}
                                                        title="Click để xem ảnh lớn"
                                                    />
                                                    <button
                                                        onClick={() => handleShowImage(news.imageUrl)}
                                                        className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                                                    >
                                                        <FaEye className="text-xs" />
                                                        Xem ảnh lớn
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {/* Modal xem ảnh lớn */}
            {showImageModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseImageModal}
                >
                    <div 
                        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={imageToShow}
                            alt="News"
                            className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                        />
                        <button
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-gray-900 bg-opacity-70 hover:bg-opacity-100 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-200 shadow-lg"
                            onClick={handleCloseImageModal}
                            aria-label="Đóng"
                        >
                            <FaTimes className="text-sm sm:text-base" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal thêm/chỉnh sửa */}
            {showModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                    onClick={handleCloseModal}
                >
                    <div 
                        className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-4xl shadow-2xl my-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                {modalType === 'add' ? 'Thêm tin tức mới' : 'Chỉnh sửa tin tức'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Đóng"
                            >
                                <FaTimes className="text-xl sm:text-2xl" />
                            </button>
                        </div>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm sm:text-base">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Cột trái */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block font-semibold text-sm sm:text-base text-gray-700 mb-2">
                                            Tiêu đề tin tức <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base shadow-sm"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập tiêu đề tin tức"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-sm sm:text-base text-gray-700 mb-2">
                                            Hình ảnh
                                        </label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base shadow-sm"
                                            value={form.imageUrl}
                                            onChange={handleChange}
                                            placeholder="Nhập tên tệp hoặc URL"
                                        />
                                        {form.imageUrl && (
                                            <div className="mt-3">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-2">Xem trước:</p>
                                                <img
                                                    src={form.imageUrl.startsWith('http') ? form.imageUrl : `${baseImagePath}${form.imageUrl}`}
                                                    alt="Preview"
                                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md border-2 border-gray-200"
                                                    onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Cột phải */}
                                <div className="space-y-5">
                                    <div>
                                        <label className="block font-semibold text-sm sm:text-base text-gray-700 mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            name="description"
                                            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base shadow-sm resize-none"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả tin tức..."
                                            rows="8"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-sm sm:text-base shadow-sm"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm sm:text-base shadow-md hover:shadow-lg"
                                >
                                    {modalType === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsManager;