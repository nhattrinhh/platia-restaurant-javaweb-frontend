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

    if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
            <ToastContainer />
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Quản Lý Tin Tức</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Tìm kiếm theo tiêu đề tin tức..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {search && (
                            <FaTimes
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500"
                                onClick={handleClearFilter}
                            />
                        )}
                    </div>
                    <button
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                        onClick={() => handleOpenModal('add')}
                    >
                        <FaPlus className="mr-2" /> Thêm tin tức
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-gray-200">
                {newsList.length === 0 ? (
                    <div className="text-center text-gray-500 py-6">
                        Không có tin tức phù hợp
                    </div>
                ) : (
                    newsList.map((news, idx) => (
                        <details
                            key={news.id}
                            className="group border-b border-gray-200 transition-all duration-200 hover:bg-gray-50"
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer select-none">
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-indigo-700">{idx + 1}.</span>
                                    <img
                                        src={news.imageUrl}
                                        alt={news.title}
                                        className="w-12 h-12 object-cover rounded"
                                        onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                    />
                                    <span className="font-semibold text-gray-900">{news.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-all duration-200"
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', news); }}
                                        title="Chỉnh sửa"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(news.id); }}
                                        title="Xóa"
                                    >
                                        <FaTrash />
                                    </button>
                                    <span className="text-gray-500 text-sm">
                                        {new Date(news.timestamp).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                            </summary>

                            <div className="px-6 pb-4 text-gray-700">
                                <p className="mb-2">
                                    <span className="font-medium">Mô tả:</span>{' '}
                                    {news.description || 'Không có mô tả.'}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">Xem hình ảnh:</span>
                                    <img
                                        src={news.imageUrl}
                                        alt={news.title}
                                        className="w-24 h-24 object-cover rounded cursor-pointer"
                                        onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                        onClick={() => handleShowImage(news.imageUrl)}
                                    />
                                </div>
                            </div>
                        </details>
                    ))
                )}
            </div>


            {/* Modal xem ảnh lớn */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl w-full">
                        <img
                            src={imageToShow}
                            alt="News"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-2xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition-all duration-200"
                            onClick={handleCloseImageModal}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal thêm/chỉnh sửa */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl backdrop-blur-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalType === 'add' ? 'Thêm tin tức' : 'Chỉnh sửa tin tức'}</h3>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Cột trái */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-medium text-sm text-gray-700">Tiêu đề tin tức *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={form.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập tiêu đề tin tức"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium text-sm text-gray-700">Hình ảnh</label>
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={form.imageUrl}
                                            onChange={handleChange}
                                            placeholder="Nhập tên tệp hoặc URL"
                                        />
                                        {form.imageUrl && (
                                            <img
                                                src={form.imageUrl.startsWith('http') ? form.imageUrl : `${baseImagePath}${form.imageUrl}`}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover mt-2 rounded"
                                                onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Cột phải */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-medium text-sm text-gray-700">Mô tả</label>
                                        <textarea
                                            name="description"
                                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Nhập mô tả tin tức"
                                            rows="6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                                    onClick={handleCloseModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
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