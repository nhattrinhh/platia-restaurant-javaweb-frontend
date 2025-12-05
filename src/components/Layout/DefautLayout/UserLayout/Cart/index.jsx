import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '../../../../../Context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart({ isOpen, onClose }) {
    const { cartItems, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    // Animation variants cho overlay
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    // Animation variants cho sidebar
    const sidebarVariants = {
        hidden: { x: '100%' },
        visible: { x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    // Animation variants cho món hàng
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay nền mờ */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />

                    {/* Sidebar giỏ hàng */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 flex flex-col"
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {/* Tiêu đề và nút đóng */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
                                Giỏ Hàng
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-amber-500 transition-colors duration-200"
                                aria-label="Đóng giỏ hàng"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Danh sách món hàng */}
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-10">Giỏ hàng của bạn đang trống.</p>
                        ) : (
                            <div className="flex-1 overflow-y-auto space-y-4">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex items-center space-x-4 bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                            loading="lazy"
                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-gray-800 font-semibold text-base">{item.name}</h3>
                                            <p className="text-gray-600 text-sm">
                                                {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => updateQuantity(item.productId, -1)}
                                                className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors duration-200"
                                                aria-label="Giảm số lượng"
                                            >
                                                -
                                            </button>
                                            <span className="text-gray-800 font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, 1)}
                                                className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors duration-200"
                                                aria-label="Tăng số lượng"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                                aria-label={`Xóa ${item.name}`}
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Tổng giá và nút thanh toán */}
                        {cartItems.length > 0 && (
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-semibold text-gray-800">
                                    <span>Tổng cộng:</span>
                                    <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                                <motion.button
                                    className="w-full mt-4 bg-amber-500 text-white p-3 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        onClose(); // Close the cart
                                        navigate('/orders'); // Navigate to /orders
                                    }}
                                >
                                    Thanh Toán
                                </motion.button>
                                <motion.button
                                    className="w-full mt-2 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearCart}
                                >
                                    Xóa Giỏ Hàng
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Cart;