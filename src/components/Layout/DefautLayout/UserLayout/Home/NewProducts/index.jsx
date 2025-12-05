import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../../../../../../Context/CartContext';
import ProductDetails from '../../../../../OtherComponent/ProductDetails';
import Cart from '../../Cart';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Component đánh giá sao
    const StarRating = ({ rating = 4.5, reviewCount = 0 }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center space-x-1 mb-4">
                <div className="flex items-center">
                    {[...Array(fullStars)].map((_, index) => (
                        <motion.div
                            key={`full-${index}`}
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </motion.div>
                    ))}
                    {hasHalfStar && (
                        <motion.div
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <Star className="w-4 h-4 text-gray-300 fill-current" />
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                        </motion.div>
                    )}
                    {[...Array(emptyStars)].map((_, index) => (
                        <motion.div
                            key={`empty-${index}`}
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Star className="w-4 h-4 text-gray-300 fill-current" />
                        </motion.div>
                    ))}
                </div>
                <div className="flex items-center space-x-2 ml-2">
                    <motion.p
                        className="text-yellow-600 font-semibold text-sm"
                        whileHover={{ scale: 1.05 }}
                    >
                        {rating.toFixed(1)}
                    </motion.p>
                    <span className="text-gray-500 text-sm">
                        ({reviewCount} đánh giá)
                    </span>
                </div>
            </div>
        );
    };

    // Hàm tạo đánh giá ngẫu nhiên cho demo
    const generateRandomRating = () => {
        const ratings = [4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9];
        const reviewCounts = [23, 45, 67, 89, 124, 156, 203, 267, 345, 456];
        return {
            rating: ratings[Math.floor(Math.random() * ratings.length)],
            reviewCount: reviewCounts[Math.floor(Math.random() * reviewCounts.length)]
        };
    };

    // Hàm tính phần trăm giảm giá
    const calculateDiscount = (originalPrice, discountedPrice) => {
        const origPrice = parseInt(originalPrice) || 0;
        const discPrice = parseInt(discountedPrice) || origPrice;
        if (origPrice <= 0 || discPrice >= origPrice) return null;
        const discount = Math.round(((origPrice - discPrice) / origPrice) * 100);
        return `Giảm ${discount}%`;
    };

    // Lấy sản phẩm mới từ API
    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/products', {
                    timeout: 5000,
                });
                const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products || [];
                const newProducts = fetchedProducts.filter(product => product.categoryName?.toLowerCase() === 'mới');
                const enrichedProducts = newProducts.map(product => {
                    const ratingData = generateRandomRating();
                    return {
                        id: product.id || Date.now() + Math.random(),
                        name: product.name || 'Sản phẩm không tên',
                        img: product.img || '/images/placeholder.jpg',
                        originalPrice: product.originalPrice || 0,
                        discountedPrice: product.discountedPrice || product.originalPrice || 0,
                        discount: calculateDiscount(product.originalPrice, product.discountedPrice),
                        description: product.description || '',
                        productTypeId: product.productTypeId,
                        productTypeName: product.productTypeName || 'Không có',
                        status: product.status || 'AVAILABLE',
                        categoryId: product.categoryId,
                        categoryName: product.categoryName || 'Không có',
                        rating: ratingData.rating,
                        reviewCount: ratingData.reviewCount
                    };
                });
                setProducts(enrichedProducts);
                setError(null);
            } catch (err) {
                setError('Không thể tải danh sách sản phẩm mới. Vui lòng thử lại sau.');
                console.error('Lỗi:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNewProducts();
    }, [navigate]);

    // Tối ưu hóa danh sách sản phẩm mới
    const optimizedProducts = useMemo(() => products, [products]);

    // Hàm mở modal chi tiết sản phẩm
    const openProductModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // Hàm xử lý đặt ngay
    const orderNow = (product) => {
        console.log('Đặt ngay:', product);
        setIsModalOpen(false);
    };

    // Hàm bật/tắt giỏ hàng
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative mb-8">
                        <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-amber-400 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <div className="backdrop-blur-sm bg-white/20 rounded-2xl p-6 shadow-xl">
                        <p className="text-slate-700 text-xl font-medium">Đang tải sản phẩm...</p>
                        <p className="text-slate-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md mx-4 border border-orange-100"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <X className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Oops! Có lỗi xảy ra</h3>
                    <p className="text-red-600 text-lg mb-6 leading-relaxed">{error}</p>
                    <button
                        onClick={() => fetchNewProducts()}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg transform hover:scale-105"
                    >
                        Thử lại
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="relative z-10 max-w-7xl mx-auto px-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
            }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            <AnimatePresence>
                <ProductDetails
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    product={selectedProduct}
                    addToCart={addToCart}
                    orderNow={orderNow}
                    setIsCartOpen={setIsCartOpen}
                />
            </AnimatePresence>
            <Cart isOpen={isCartOpen} onClose={toggleCart} />
            {optimizedProducts.length === 0 ? (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShoppingCart className="w-16 h-16 text-gray-400" />
                    </div>
                    <div className="backdrop-blur-sm bg-white/60 rounded-3xl p-10 max-w-md mx-auto shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Chưa có sản phẩm</h3>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Hiện tại chưa có sản phẩm mới nào. Hãy quay lại sau nhé!
                        </p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg transform hover:scale-105 group"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Xem thực đơn
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {optimizedProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out border border-white/20 hover:shadow-2xl hover:shadow-orange-200/40"
                            whileHover={{ scale: 1.02, y: -12 }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                            <div className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                {product.discount && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                                            {product.discount}
                                        </div>
                                    </div>
                                )}
                                <motion.img
                                    src={product.img}
                                    alt={product.name}
                                    className="w-full h-56 object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                                    loading="lazy"
                                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="relative p-8 group-hover:bg-gradient-to-br group-hover:from-white/90 group-hover:to-orange-50/50 transition-all duration-300">
                                <motion.h3
                                    className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-orange-600 line-clamp-2"
                                    whileHover={{ x: 4 }}
                                >
                                    {product.name}
                                </motion.h3>
                                <StarRating
                                    rating={product.rating}
                                    reviewCount={product.reviewCount}
                                />
                                <div className="flex items-center space-x-3 mb-4">
                                    <motion.p
                                        className="text-gray-600 line-through text-lg group-hover:text-gray-500 transition-colors duration-300"
                                        whileHover={{ scale: 0.95 }}
                                    >
                                        {product.originalPrice.toLocaleString('vi-VN')} VNĐ
                                    </motion.p>
                                    <motion.p
                                        className="text-orange-600 font-bold text-xl group-hover:text-orange-500 transition-colors duration-300"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {product.discountedPrice.toLocaleString('vi-VN')} VNĐ
                                    </motion.p>
                                </div>
                                {product.discount && (
                                    <motion.p
                                        className="text-sm text-orange-600 font-semibold mb-6 group-hover:text-orange-500 transition-colors duration-300"
                                        whileHover={{ x: 2 }}
                                    >
                                        {product.discount}
                                    </motion.p>
                                )}
                                <motion.button
                                    onClick={() => openProductModal(product)}
                                    className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg group-hover:shadow-xl transform hover:scale-105 group/button overflow-hidden"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-500"></div>
                                    <div className="relative flex items-center">
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="group-hover/button:animate-spin"
                                        >
                                            <ShoppingCart className="w-5 h-5 mr-2" />
                                        </motion.div>
                                        Đặt ngay
                                        <motion.div
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="group-hover/button:animate-bounce"
                                        >
                                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/button:translate-x-1" />
                                        </motion.div>
                                    </div>
                                </motion.button>
                            </div>
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-10 left-10 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-100"></div>
                                <div className="absolute top-20 right-16 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-200"></div>
                                <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-300"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default NewProducts;