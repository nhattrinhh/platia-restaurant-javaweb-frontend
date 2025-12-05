import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ShoppingBag, Truck, Utensils, Star, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2, ease: 'easeIn' } },
};

const floatingElements = {
    float: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

function ProductDetails({ isOpen, onClose, product, addToCart, orderNow, setIsCartOpen }) {
    const [quantity, setQuantity] = React.useState(1);
    const [isFavorite, setIsFavorite] = React.useState(false);
    const navigate = useNavigate();
    const calculateDiscount = (originalPrice, discountedPrice) => {
        const origPrice = parseInt(originalPrice);
        const discPrice = parseInt(discountedPrice);
        if (origPrice === discPrice || origPrice <= 0) return 0;
        return Math.round(((origPrice - discPrice) / origPrice) * 100);
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, quantity);
            toast.success('Thêm vào giỏ hàng thành công!');
            setIsCartOpen(true);
            onClose();
        } catch (error) {
            toast.error(`${error.response?.data || 'Vui lòng đăng nhập'}`);
        }
    };

    const handleOrderNow = () => {
        navigate('/orders', {
            state: {
                orderNowItem: {
                    productId: product.id,
                    name: product.name,
                    price: parseInt(product.discountedPrice),
                    quantity: quantity,
                    image: product.img,
                    description: product.description,
                    category: product.categoryName,
                    productType: product.productTypeName
                }
            }
        });
        onClose();
    };

    if (!isOpen || !product) return null;

    const discountPercent = calculateDiscount(product.originalPrice, product.discountedPrice);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden relative shadow-2xl border border-gray-100 flex flex-col"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Gradient Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-blue-50/30 pointer-events-none" />

                    {/* Header với nút đóng */}
                    <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center z-10">
                        <div className="flex items-center space-x-4">
                            <motion.div
                                className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
                                variants={floatingElements}
                                animate="float"
                            >
                                <Utensils className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate pr-4">
                                    {product.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Chi tiết sản phẩm</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <motion.button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-3 rounded-full transition-all duration-200 ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </motion.button>
                            <motion.button
                                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Share2 className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Nội dung cuộn */}
                    <div className="overflow-y-auto max-h-[calc(95vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 pb-8">
                            {/* Cột trái - Hình ảnh */}
                            <div className="space-y-6">
                                <motion.div
                                    className="relative group"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl border border-gray-200"
                                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                    />
                                    {discountPercent > 0 && (
                                        <motion.div
                                            className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                                            initial={{ scale: 0, rotate: -12 }}
                                            animate={{ scale: 1, rotate: -12 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            -{discountPercent}%
                                        </motion.div>
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-medium text-gray-700">4.8</span>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                        <ShoppingBag className="w-5 h-5 mr-2 text-orange-500" />
                                        Có sẵn trên:
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        <motion.div
                                            className="flex items-center bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-4 py-3 rounded-xl border border-orange-300 shadow-sm"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ShoppingBag className="w-5 h-5 mr-2" />
                                            <span className="text-sm font-semibold">ShopeeFood</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-4 py-3 rounded-xl border border-green-300 shadow-sm"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Truck className="w-5 h-5 mr-2" />
                                            <span className="text-sm font-semibold">GrabFood</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-4 py-3 rounded-xl border border-blue-300 shadow-sm"
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Utensils className="w-5 h-5 mr-2" />
                                            <span className="text-sm font-semibold">Baemin</span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Cột phải - Thông tin */}
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {product.description || 'Không có mô tả'}
                                    </p>
                                </motion.div>

                                <motion.div
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4 border border-gray-200"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium">Loại sản phẩm:</span>
                                        <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full text-sm">
                                            {product.productTypeName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium">Danh mục:</span>
                                        <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full text-sm">
                                            {product.categoryName === 'FEATURED' ? 'Nổi bật' :
                                                product.categoryName === 'NEW' ? 'Mới' :
                                                    product.categoryName === 'BESTSELLER' ? 'Bán chạy' :
                                                        product.categoryName === 'PROMOTIONS' ? 'Giảm giá sâu' :
                                                            product.categoryName || 'Không có'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-600 font-medium">Tình trạng:</span>
                                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${product.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                            product.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {product.status === 'AVAILABLE' ? 'Có sẵn' :
                                                product.status === 'OUT_OF_STOCK' ? 'Hết hàng' :
                                                    product.status === 'DISCONTINUED' ? 'Ngừng kinh doanh' :
                                                        product.status || 'Không xác định'}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Giá */}
                                <motion.div
                                    className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-2xl p-6 border border-orange-200 shadow-sm"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            {discountPercent > 0 && (
                                                <span className="text-gray-400 line-through text-lg font-medium">
                                                    {parseInt(product.originalPrice).toLocaleString('vi-VN')}đ
                                                </span>
                                            )}
                                            <span className="text-red-500 font-bold text-3xl">
                                                {parseInt(product.discountedPrice).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        {discountPercent > 0 && (
                                            <div className="text-right">
                                                <span className="text-green-600 font-bold text-sm block">
                                                    Tiết kiệm {discountPercent}%
                                                </span>
                                                <span className="text-green-500 text-xs">
                                                    {(parseInt(product.originalPrice) - parseInt(product.discountedPrice)).toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Số lượng */}
                                <motion.div
                                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Số lượng:</h3>
                                    <div className="flex items-center justify-center space-x-6">
                                        <motion.button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="w-14 h-14 flex items-center justify-center bg-white border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-orange-400 transition-all duration-200 shadow-md hover:shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <span className="text-xl font-bold">-</span>
                                        </motion.button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-24 text-center border-2 border-gray-300 rounded-2xl py-4 text-gray-700 font-bold text-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 bg-white shadow-md"
                                            min="1"
                                        />
                                        <motion.button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="w-14 h-14 flex items-center justify-center bg-white border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-orange-400 transition-all duration-200 shadow-md hover:shadow-lg"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <span className="text-xl font-bold">+</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                onClick={handleAddToCart}
                                className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:via-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl border border-blue-400"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ShoppingCart className="w-6 h-6 mr-3" />
                                Thêm vào giỏ hàng
                            </motion.button>
                            <motion.button
                                onClick={handleOrderNow}
                                className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl border border-orange-400"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                    className="mr-3"
                                >
                                    ⚡
                                </motion.div>
                                Đặt ngay
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProductDetails;