import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const MenuCategories = () => {
    const menuCategories = [
        { id: 1, name: 'Gà rán', img: '/images/Product/garan.jpg', slug: 'ga-ran' },
        { id: 2, name: 'Mỳ ý', img: '/images/Product/myy.jpg', slug: 'my-y' },
        { id: 3, name: 'Pizza', img: '/images/Product/pizza.png', slug: 'pizza' },
        { id: 4, name: 'Cơm', img: '/images/Product/com.jpg', slug: 'com' },
        { id: 5, name: 'Salad', img: '/images/Product/salad.jpg', slug: 'salad' },
        { id: 6, name: 'Bánh', img: '/images/Product/banh.png', slug: 'banh' },
    ];

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    return (
        <motion.section
            className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-tr from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-amber-200/25 to-orange-200/25 rounded-full blur-2xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                            Khám Phá Hương Vị
                        </span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>
                    <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-tight">
                        Lựa Chọn Thực Đơn
                    </h2>
                    <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Từ những món ăn truyền thống đến hiện đại, chúng tôi mang đến cho bạn trải nghiệm ẩm thực đa dạng và phong phú
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                    {menuCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <Link to="/menu" className="block">
                                <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 group-hover:border-orange-200/50">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-amber-400/5 to-yellow-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500 scale-110"></div>
                                        <motion.div
                                            className="relative z-10"
                                            whileHover={{ scale: 1.1, rotate: 3 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                        >
                                            <img
                                                src={category.img}
                                                alt={category.name}
                                                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300"
                                            />
                                        </motion.div>
                                        <div className="absolute inset-0 rounded-full border-2 border-orange-200/30 group-hover:border-orange-400/50 transition-all duration-500 scale-125"></div>
                                    </div>
                                    <div className="relative z-10 text-center">
                                        <h3 className="text-slate-800 font-bold text-lg md:text-xl group-hover:text-orange-600 transition-all duration-300 mb-2">
                                            {category.name}
                                        </h3>
                                        <div className="w-0 h-0.5 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto group-hover:w-8 transition-all duration-500 rounded-full"></div>
                                    </div>
                                    <motion.div
                                        className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500 animate-ping"></div>
                                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/50 backdrop-blur-sm rounded-full border border-orange-200/50 shadow-lg">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full border-2 border-white"></div>
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full border-2 border-white"></div>
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-slate-700 font-medium">
                            Hơn 100+ món ăn đang chờ bạn khám phá
                        </span>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default MenuCategories;