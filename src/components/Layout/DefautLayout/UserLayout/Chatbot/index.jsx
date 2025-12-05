import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Sparkles, MessageCircle, Coffee, Star, Zap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chatbot({ isOpen, onClose, openProductModal }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Danh sách câu hỏi gợi ý
    const questionSuggestions = [
        { text: "Có món gì phù hợp cho bữa sáng?", icon: <Coffee className="w-4 h-4" /> },
        { text: "Món nào bán chạy nhất ?", icon: <Star className="w-4 h-4" /> },
        { text: "Tư vấn các món mới của nhà hàng", icon: <Sparkles className="w-4 h-4" /> },
        { text: "Gợi ý món bánh ngọt", icon: <Zap className="w-4 h-4" /> },
        { text: "Tư vấn các món cơm", icon: <Coffee className="w-4 h-4" /> },
        { text: "Đồ uống có gì ?", icon: <Sparkles className="w-4 h-4" /> }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, suggestedProducts]);

    const chatVariants = {
        hidden: { y: '100%', opacity: 0, scale: 0.9 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    const messageVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    };

    const productVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    };

    const suggestionVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    };

    const handleSendMessage = async (messageText = null) => {
        const messageToSend = messageText || input;
        if (!messageToSend.trim()) return;

        const userMessage = { role: 'user', content: messageToSend };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/chatbot', { message: messageToSend });
            const botReply = response.data.reply || 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!';
            const products = response.data.products || [];
            setMessages((prev) => [...prev, { role: 'bot', content: botReply }]);
            const recommendedProducts = extractRecommendedProducts(botReply, products);
            setSuggestedProducts(recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 3));
        } catch (error) {
            console.error('Error calling chatbot API:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'bot', content: 'Xin lỗi, có lỗi khi xử lý yêu cầu. Vui lòng thử lại!' },
            ]);
            setSuggestedProducts([]);
            toast.error('Lỗi khi xử lý yêu cầu. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    const extractRecommendedProducts = (botReply, products) => {
        const lowerReply = botReply.toLowerCase();
        const recommended = products.filter(product =>
            lowerReply.includes(product.name.toLowerCase())
        );
        return recommended.length > 0 ? recommended.slice(0, 3) : products.slice(0, 3);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleProductClick = (product) => {
        if (product.status === 'OUT_OF_STOCK' || product.status === 'DISCONTINUED') {
            toast.error(`Sản phẩm "${product.name}" hiện ${product.status.toLowerCase() === 'out_of_stock' ? 'hết hàng' : 'ngừng kinh doanh'}.`);
            return;
        }
        if (openProductModal) {
            openProductModal(product);
            onClose();
        } else {
            navigate(`/menu?search=${encodeURIComponent(product.name)}`);
            onClose();
        }
    };

    const handleSuggestionClick = (suggestionText) => {
        handleSendMessage(suggestionText);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed bottom-6 right-6 w-full max-w-md h-[600px] z-50 overflow-hidden"
                        variants={chatVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 h-full flex flex-col relative">
                            {/* Glassmorphism overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl" />

                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                className="!top-2 !right-2"
                                toastClassName="!bg-white/90 !backdrop-blur-md !rounded-2xl !shadow-xl !border !border-gray-200/50"
                            />

                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 p-6 rounded-t-3xl">
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-purple-600/90 rounded-t-3xl backdrop-blur-sm" />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                            <Bot className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white tracking-tight">Chatbot Tư Vấn</h2>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <p className="text-white/80 text-sm">Đang hoạt động</p>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={onClose}
                                        className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-200 border border-white/20"
                                        aria-label="Đóng chatbot"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-slate-50/80 to-indigo-50/50 backdrop-blur-sm" aria-live="polite">
                                {/* Welcome and Suggestions (Always at the Top of History) */}
                                <motion.div
                                    className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200/50"
                                    variants={messageVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div
                                        className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, 0, -5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatDelay: 2
                                        }}
                                    >
                                        <MessageCircle className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">Xin chào! 👋</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 text-center">
                                        Hỏi tôi về món ăn bạn muốn nhé!<br />
                                        Tôi sẽ giúp bạn tìm kiếm và gợi ý những món ngon nhất
                                    </p>

                                    {/* Question Suggestions */}
                                    <div className="space-y-4">
                                        <p className="text-gray-600 font-medium text-sm text-center">Hoặc thử những câu hỏi sau:</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {questionSuggestions.map((suggestion, index) => (
                                                <motion.button
                                                    key={index}
                                                    className="flex items-center space-x-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-violet-50/80 hover:border-violet-300/50 transition-all duration-200 text-left group shadow-sm"
                                                    variants={suggestionVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    transition={{ delay: index * 0.1 }}
                                                    onClick={() => handleSuggestionClick(suggestion.text)}
                                                    whileHover={{ scale: 1.02, y: -1 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    disabled={isLoading}
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg flex items-center justify-center group-hover:from-violet-200 group-hover:to-indigo-200 transition-colors">
                                                        <div className="text-violet-600">
                                                            {suggestion.icon}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-violet-700 transition-colors flex-1">
                                                        {suggestion.text}
                                                    </span>
                                                    <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Send className="w-3 h-3 text-white" />
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Messages and Suggested Products */}
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex items-end space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        variants={messageVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] p-4 rounded-2xl shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-br-md'
                                                : 'bg-white/80 text-gray-800 border border-gray-200/50 rounded-bl-md'
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {suggestedProducts.length > 0 && (
                                    <motion.div
                                        className="space-y-4"
                                        variants={messageVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Sparkles className="w-5 h-5 text-violet-600" />
                                            <p className="text-gray-700 font-semibold">Sản phẩm gợi ý cho bạn</p>
                                        </div>
                                        {suggestedProducts.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl hover:border-violet-300/50 transition-all duration-300 cursor-pointer group"
                                                variants={productVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => handleProductClick(product)}
                                                role="button"
                                                aria-label={`Xem chi tiết sản phẩm ${product.name}`}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <img
                                                            src={product.img || '/images/placeholder.jpg'}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                        />
                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                            <Sparkles className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-gray-800 font-semibold text-base group-hover:text-violet-600 transition-colors truncate">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-violet-600 font-bold text-sm">
                                                            {parseInt(product.discountedPrice || product.originalPrice).toLocaleString('vi-VN')} VNĐ
                                                        </p>
                                                        <div className="flex items-center mt-1">
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${product.status === 'AVAILABLE' ? 'bg-green-400' :
                                                                product.status === 'OUT_OF_STOCK' ? 'bg-red-400' : 'bg-gray-400'
                                                                }`} />
                                                            <p className="text-gray-500 text-xs font-medium">
                                                                {product.status === 'AVAILABLE' ? 'Có sẵn' :
                                                                    product.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngừng kinh doanh'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {isLoading && (
                                    <motion.div
                                        className="flex items-end space-x-3 justify-start"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200/50">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-gray-600 text-sm">Đang suy nghĩ...</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-5 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 rounded-b-3xl">
                                <div className="flex items-end space-x-3">
                                    <div className="flex-1 relative">
                                        <textarea
                                            className="w-full p-4 pr-12 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm text-gray-800 placeholder-gray-400 resize-none transition-all duration-200 shadow-sm"
                                            rows="2"
                                            placeholder="Nhập câu hỏi của bạn..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={isLoading}
                                            aria-label="Nhập câu hỏi cho chatbot"
                                            maxLength={500}
                                        />
                                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                            {input.length}/500
                                        </div>
                                    </div>
                                    <motion.button
                                        className="p-4 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-2xl hover:from-violet-600 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[56px]"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSendMessage()}
                                        disabled={isLoading || !input.trim()}
                                        aria-label="Gửi tin nhắn"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Chatbot;