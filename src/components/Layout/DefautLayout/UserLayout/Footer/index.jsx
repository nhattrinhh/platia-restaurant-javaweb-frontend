import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

function Footer() {
    const controls = useAnimation();
    const footerRef = useRef(null);
    const isInView = useInView(footerRef, { once: true, amount: 0.3 });

    // Animation variants for footer and items
    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: index * 0.15, ease: 'easeOut' },
        }),
    };

    // Trigger animation when footer is in view
    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    return (
        <motion.footer
            ref={footerRef}
            className="py-12 bg-white text-gray-800 border-t border-orange-100/50 relative"
            initial="hidden"
            animate={controls}
            variants={footerVariants}
        >
            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Logo & Contact Info */}
                    <motion.div custom={0} variants={itemVariants} className="space-y-4">
                        <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 font-montserrat">
                            Platia
                        </Link>
                        <p className="text-gray-600 italic text-sm leading-relaxed">
                            Thưởng thức món ăn ngon, giao hàng tận nơi
                        </p>
                        <div className="text-gray-700 text-sm space-y-2">
                            <div className="flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-orange-600" />
                                <span>0123 456 789</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-orange-600" />
                                <span>contact@platia.com</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                                <span>123 Đường Ẩm Thực, TP.HCM</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div custom={1} variants={itemVariants} className="space-y-4">
                        <h5 className="text-lg font-bold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-gradient-to-r after:from-orange-500 after:to-amber-600 after:rounded">
                            Liên kết nhanh
                        </h5>
                        <ul className="space-y-2">
                            {[
                                { to: '/menu', label: 'Thực đơn' },
                                { to: '/cart', label: 'Giỏ hàng' },
                                { to: '/about', label: 'Về chúng tôi' },
                                { to: '/contact', label: 'Liên hệ' },
                            ].map((link, index) => (
                                <motion.li
                                    key={link.to}
                                    whileHover={{ x: 8, color: '#f97316' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={link.to} className="text-gray-600 flex items-center text-sm hover:text-orange-600 transition-colors">
                                        <span className="mr-2">›</span> {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Services */}
                    <motion.div custom={2} variants={itemVariants} className="space-y-4">
                        <h5 className="text-lg font-bold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-gradient-to-r after:from-orange-500 after:to-amber-600 after:rounded">
                            Dịch vụ
                        </h5>
                        <ul className="space-y-2">
                            {[
                                { to: '/orders', label: 'Đặt hàng' },
                                { to: '/delivery', label: 'Giao hàng' },
                                { to: '/promotions', label: 'Khuyến mãi' },
                                { to: '/support', label: 'Hỗ trợ' },
                            ].map((link, index) => (
                                <motion.li
                                    key={link.to}
                                    whileHover={{ x: 8, color: '#f97316' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={link.to} className="text-gray-600 flex items-center text-sm hover:text-orange-600 transition-colors">
                                        <span className="mr-2">›</span> {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter & Social */}
                    <motion.div custom={3} variants={itemVariants} className="space-y-4">
                        <h5 className="text-lg font-bold text-gray-800 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-gradient-to-r after:from-orange-500 after:to-amber-600 after:rounded">
                            Kết nối với chúng tôi
                        </h5>
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm mb-2">Đăng ký nhận ưu đãi mới nhất</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    className="flex-grow border border-orange-200 rounded-l-full px-4 py-2 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm transition-all duration-300"
                                    placeholder="Email của bạn"
                                    aria-label="Email subscription"
                                />
                                <button className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-r-full hover:from-orange-600 hover:to-amber-700 shadow-md transition-all duration-300">
                                    <Mail className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            {[
                                { href: 'https://facebook.com', icon: Facebook, hoverColor: 'hover:bg-blue-600' },
                                { href: 'https://instagram.com', icon: Instagram, hoverColor: 'hover:bg-pink-600' },
                                { href: 'https://youtube.com', icon: Youtube, hoverColor: 'hover:bg-red-600' },
                                { href: 'https://twitter.com', icon: Twitter, hoverColor: 'hover:bg-blue-400' },
                            ].map((social, index) => (
                                <motion.a
                                    key={social.href}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-gray-600 ${social.hoverColor} hover:text-white transition-all duration-300 shadow-md hover:shadow-lg`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <hr className="border-orange-100/50 my-8" />

                <motion.div
                    custom={4}
                    variants={itemVariants}
                    className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600"
                >
                    <p className="mb-2 md:mb-0">© {new Date().getFullYear()} Platia. All rights reserved.</p>
                    <div className="flex space-x-4">
                        {[
                            { to: '/privacy', label: 'Chính sách bảo mật' },
                            { to: '/terms', label: 'Điều khoản sử dụng' },
                        ].map((link) => (
                            <motion.div
                                key={link.to}
                                whileHover={{ x: 4, color: '#f97316' }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link to={link.to} className="text-gray-600 hover:text-orange-600 transition-colors">
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
}

export default Footer;