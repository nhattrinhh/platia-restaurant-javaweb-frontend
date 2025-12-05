import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import banner1Img from '../../../assets/images/product/banner-1.jpg';
import banner2Img from '../../../assets/images/product/banner-4.jpg';
import banner3Img from '../../../assets/images/product/banner-6.jpg';
import MenuCategories from '../../../components/Layout/DefautLayout/UserLayout/Home/MenuCategories';
import Promotions from '../../../components/Layout/DefautLayout/UserLayout/Home/Promotions';
import FeaturedProducts from '../../../components/Layout/DefautLayout/UserLayout/Home/FeaturedProducts';
import NewProducts from '../../../components/Layout/DefautLayout/UserLayout/Home/NewProducts';
import BestSellingProducts from '../../../components/Layout/DefautLayout/UserLayout/Home/BestSellingProducts';
import Testimonials from '../../../components/Layout/DefautLayout/UserLayout/Home/Testimonials';

function Home() {
    const sliderImages = [
        { src: banner1Img },
        { src: banner2Img },
        { src: banner3Img },
    ];

    const vouchers = [
        { code: 'GIAM20K', description: 'Giảm 20K cho đơn từ 100K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'FREESHIP', description: 'Miễn phí giao hàng cho đơn từ 150K', expiry: 'Hết hạn: 30/06/2025' },
        { code: 'GIAM50K', description: 'Giảm 50K cho đơn từ 200K', expiry: 'Hết hạn: 20/06/2025' },
    ];

    const advertisementImages = [
        { src: '/images/Product/quangcao-1.jpg', alt: 'Quảng Cáo 1' },
        { src: '/images/Product/quangcao-2.jpg', alt: 'Quảng Cáo 2' },
    ];

    const additionalAdvertisement = {
        src: '/images/Product/qc-6.jpg',
        alt: 'Quảng Cáo Khuyến Mãi',
    };

    const additionalAdvertisement2 = {
        src: '/images/Product/qc-4.jpg',
        alt: 'Quảng Cáo',
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeCategory, setActiveCategory] = useState('featured');
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    useEffect(() => {
        if (location.pathname === '/promotions') {
            const promotionsSection = document.getElementById('promotions');
            if (promotionsSection) {
                promotionsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.pathname]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const slideVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeInOut' } },
        exit: { opacity: 0, x: -100, transition: { duration: 0.7, ease: 'easeInOut' } },
    };

    return (
        <div className="w-full">
            {/* Slider */}
            <div className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-3xl shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/40 via-amber-500/40 to-yellow-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm animate-pulse"></div>
                <AnimatePresence mode="wait">
                    {sliderImages.map((slide, index) => (
                        index === currentSlide && (
                            <motion.div
                                key={index}
                                className="absolute w-full h-full rounded-3xl overflow-hidden"
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <Link to="/menu" className="block w-full h-full relative group/image">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover/image:translate-x-full transition-transform duration-1200 ease-out z-30"></div>
                                    <motion.img
                                        src={slide.src}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-110 filter brightness-110"
                                        loading="lazy"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.7 }}
                                    />
                                    <div className="absolute inset-0 pointer-events-none z-20">
                                        <motion.div
                                            className="absolute top-20 left-20 w-4 h-4 bg-orange-400/70 rounded-full opacity-0 group-hover/image:opacity-100"
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0, 0.7, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: 0.1
                                            }}
                                        />
                                        <motion.div
                                            className="absolute top-40 right-32 w-3 h-3 bg-amber-400/70 rounded-full opacity-0 group-hover/image:opacity-100"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0, 0.8, 0]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                delay: 0.3
                                            }}
                                        />
                                        <motion.div
                                            className="absolute bottom-32 left-40 w-3.5 h-3.5 bg-yellow-400/70 rounded-full opacity-0 group-hover/image:opacity-100"
                                            animate={{
                                                scale: [1, 1.4, 1],
                                                opacity: [0, 0.6, 0]
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                delay: 0.5
                                            }}
                                        />
                                        <motion.div
                                            className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-orange-300/70 rounded-full opacity-0 group-hover/image:opacity-100"
                                            animate={{
                                                scale: [1, 1.6, 1],
                                                opacity: [0, 0.9, 0]
                                            }}
                                            transition={{
                                                duration: 2.2,
                                                repeat: Infinity,
                                                delay: 0.7
                                            }}
                                        />
                                        <motion.div
                                            className="absolute top-1/2 left-1/3 w-2 h-2 bg-rose-400/60 rounded-full opacity-0 group-hover/image:opacity-100"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0, 0.5, 0]
                                            }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                                delay: 0.9
                                            }}
                                        />
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
                <motion.button
                    onClick={goToPrevSlide}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 z-30 group/btn border border-white/30"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-amber-400/30 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <motion.div
                        animate={{ x: [-2, 2, -2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronLeft className="w-8 h-8 text-gray-900 relative z-10 drop-shadow-sm" />
                    </motion.div>
                </motion.button>
                <motion.button
                    onClick={goToNextSlide}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 z-30 group/btn border border-white/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-amber-400/30 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <motion.div
                        animate={{ x: [2, -2, 2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronRight className="w-8 h-8 text-gray-900 relative z-10 drop-shadow-sm" />
                    </motion.div>
                </motion.button>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                    <div className="bg-black/30 backdrop-blur-md rounded-full px-8 py-4 border border-white/30 shadow-xl">
                        <div className="flex space-x-4">
                            {sliderImages.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`relative transition-all duration-300 ${currentSlide === index
                                        ? 'w-10 h-5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-lg'
                                        : 'w-5 h-5 bg-white/70 hover:bg-white/90 rounded-full shadow-md'
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    {currentSlide === index && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full blur-md opacity-60"
                                            animate={{
                                                scale: [1, 1.3, 1],
                                                opacity: [0.6, 0.9, 0.6]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    )}
                                    <motion.div
                                        className="absolute inset-0 bg-white/40 rounded-full opacity-0"
                                        whileHover={{
                                            scale: [1, 1.8, 1],
                                            opacity: [0, 0.4, 0]
                                        }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/30 z-30">
                    <motion.div
                        className="h-full bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-400 shadow-lg"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentSlide + 1) / sliderImages.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-orange-400/20 via-amber-500/20 to-yellow-400/20 blur-sm"></div>
                </div>
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                    <motion.div
                        className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-orange-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            borderColor: ["rgba(251, 146, 60, 0.5)", "rgba(245, 158, 11, 0.5)", "rgba(251, 146, 60, 0.5)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-amber-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            borderColor: ["rgba(245, 158, 11, 0.5)", "rgba(234, 179, 8, 0.5)", "rgba(245, 158, 11, 0.5)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-yellow-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            borderColor: ["rgba(234, 179, 8, 0.5)", "rgba(251, 146, 60, 0.5)", "rgba(234, 179, 8, 0.5)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    />
                    <motion.div
                        className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-orange-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{
                            borderColor: ["rgba(251, 146, 60, 0.5)", "rgba(245, 158, 11, 0.5)", "rgba(251, 146, 60, 0.5)"]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    />
                </div>
                <div className="absolute inset-0 pointer-events-none z-20">
                    <motion.div
                        className="absolute top-1/4 left-1/4 w-40 h-40 bg-orange-400/15 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0, 0.4, 0],
                            x: [0, 20, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.div
                        className="absolute top-3/4 right-1/4 w-32 h-32 bg-amber-400/15 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0, 0.5, 0],
                            x: [0, -15, 0],
                            y: [0, 15, 0]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.7
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.3, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.2
                        }}
                    />
                </div>
            </div>

            {/* Lựa chọn thực đơn */}
            <MenuCategories />

            {/* Voucher Section */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>
                <div className="w-[90%] mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                            <span className="text-orange-400 font-medium text-lg tracking-wider uppercase">Đặc Quyền</span>
                            <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 mb-4 font-montserrat tracking-tight">
                            Ưu Đãi Voucher
                        </h2>
                        <p className="text-slate-600 text-xl max-w-2xl mx-auto leading-relaxed">
                            Khám phá những ưu đãi độc quyền được thiết kế riêng cho bạn
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {vouchers.map((voucher, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-sm group-hover:blur-none transition-all duration-500"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full">
                                                <span className="text-white font-bold text-sm tracking-wider uppercase">
                                                    Voucher
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">%</span>
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400 mb-4 tracking-wide">
                                            {voucher.code}
                                        </h3>
                                        <p className="text-slate-600 mb-4 text-lg leading-relaxed">
                                            {voucher.description}
                                        </p>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                                            <span className="text-slate-500 text-sm">
                                                {voucher.expiry}
                                            </span>
                                        </div>
                                        <motion.button
                                            className="w-full relative group/btn overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl p-[2px]"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="bg-slate-900 rounded-2xl px-8 py-4 group-hover/btn:bg-transparent transition-all duration-300">
                                                <span className="relative z-10 text-white font-bold text-lg tracking-wide">
                                                    Nhận Ngay
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 opacity-0 group-hover/btn:opacity-100 transition-all duration-300 rounded-2xl blur-sm"></div>
                                        </motion.button>
                                    </div>
                                </div>
                                <motion.div
                                    className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                                        scale: { duration: 2, repeat: Infinity },
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <p className="text-slate-600 mb-6 text-lg">
                            Còn nhiều ưu đãi hấp dẫn khác đang chờ bạn
                        </p>
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-2xl text-white font-semibold hover:from-slate-700 hover:to-slate-600 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Xem Tất Cả Ưu Đãi
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>

            {/* Khuyến mãi */}
            <Promotions />

            {/* Quảng Cáo (mới) */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 w-full advertisement-fullwidth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <motion.img
                    src={additionalAdvertisement.src}
                    alt={additionalAdvertisement.alt}
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    loading="lazy"
                />
            </motion.section>

            {/* Product Section */}
            <motion.section
                className="py-20 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
                id="products"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                            <span className="text-orange-600 font-semibold text-sm tracking-[0.2em] uppercase px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full border border-orange-100">
                                Thực Đơn Hot
                            </span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        </div>
                        <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-8 font-montserrat tracking-tight leading-tight">
                            Món Hot & Đỉnh
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-slate-700 text-xl leading-relaxed md-6">
                                Thưởng thức các món ăn mới nhất và được yêu thích nhất tại Platia. Đặt ngay!
                            </p>
                        </div>
                        <div className="flex justify-center gap-4 mt-3">
                            {['featured', 'new', 'best-selling'].map((category) => (
                                <motion.button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 ${activeCategory === category
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg'
                                        : 'bg-white/80 backdrop-blur-sm border border-orange-200 text-slate-700 hover:bg-white'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {category === 'featured' && 'Thực đơn nổi bật'}
                                    {category === 'new' && 'Thực đơn mới'}
                                    {category === 'best-selling' && 'Thực đơn bán chạy'}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.6 }}
                        >
                            {activeCategory === 'featured' && <FeaturedProducts />}
                            {activeCategory === 'new' && <NewProducts />}
                            {activeCategory === 'best-selling' && <BestSellingProducts />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.section>

            {/* Ưu Đãi Đặc Biệt */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 w-full advertisement-fullwidth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat text-center mb-6 tracking-tight leading-snug">
                    Ưu Đãi Đặc Biệt
                </h2>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {advertisementImages.map((ad, index) => (
                        <motion.img
                            key={index}
                            src={ad.src}
                            alt={ad.alt}
                            className="w-full h-[300px] lg:h-[400px] object-cover rounded-lg"
                            loading="lazy"
                        />
                    ))}
                </div>
            </motion.section>

            {/* Ý kiến khách hàng */}
            <Testimonials />

            {/* Quảng Cáo 2 */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 w-full advertisement-fullwidth"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <motion.img
                    src={additionalAdvertisement2.src}
                    alt={additionalAdvertisement2.alt}
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    loading="lazy"
                />
            </motion.section>

            {/* Đăng ký */}
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
                        <motion.div
                            className="lg:col-span-3 space-y-8 text-center lg:text-left order-2 lg:order-1"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 font-montserrat tracking-tight">
                                    Khám phá thế giới với Platia
                                </h1>
                                <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                                    Đăng ký ngay để nhận các ưu đãi, lời khuyên ẩm thực và cập nhật mới nhất từ chúng tôi.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto lg:mx-0">
                                    <input
                                        type="email"
                                        placeholder="Nhập email của bạn"
                                        className="flex-grow border border-orange-200 rounded-full px-6 py-4 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm transition-all duration-300 text-base"
                                        aria-label="Email đăng ký"
                                    />
                                    <motion.button
                                        className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full hover:from-orange-600 hover:to-amber-700 shadow-md transition-all duration-300 font-semibold whitespace-nowrap"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Đăng ký
                                    </motion.button>
                                </div>
                                <p className="text-slate-500 text-sm max-w-lg mx-auto lg:mx-0">
                                    Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng và chính sách bảo mật của chúng tôi.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-orange-100">
                                <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-4">
                                    Có bữa ăn mơ ước của bạn trong tầm tay. Tải xuống ứng dụng.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <motion.a
                                        href="#"
                                        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl px-6 py-3 hover:bg-white transition-all duration-300 shadow-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs text-slate-500">Tải về từ</div>
                                            <div className="text-sm font-semibold text-slate-700">App Store</div>
                                        </div>
                                    </motion.a>
                                    <motion.a
                                        href="#"
                                        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-xl px-6 py-3 hover:bg-white transition-all duration-300 shadow-sm"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs text-slate-500">Tải về từ</div>
                                            <div className="text-sm font-semibold text-slate-700">Google Play</div>
                                        </div>
                                    </motion.a>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="lg:col-span-2 flex justify-center lg:justify-end order-1 lg:order-2"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-2xl transform rotate-3 scale-105"></div>
                                <img
                                    src="/images/app-phone.png"
                                    alt="Ứng dụng Platia"
                                    className="relative w-80 h-96 md:w-96 md:h-[500px] lg:w-[400px] lg:h-[520px] object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                    <span className="text-white text-3xl">🍕</span>
                                </div>
                                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-1000">
                                    <span className="text-white text-2xl">🍔</span>
                                </div>
                                <div className="absolute top-1/2 -left-8 w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-500">
                                    <span className="text-white text-xl">🥤</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}

export default Home;