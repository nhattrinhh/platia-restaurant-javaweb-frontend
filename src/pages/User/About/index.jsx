import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function About() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="w-full overflow-hidden">
            {/* Modern Hero Section */}
            <motion.section
                className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-black flex items-center justify-center overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500/20 border border-orange-500/30 rounded-full backdrop-blur-sm mb-8">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <span className="text-orange-300 font-semibold tracking-wider uppercase text-sm">
                                Chào Mừng Đến Với
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-6xl lg:text-8xl font-black font-montserrat mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        Platia
                    </motion.h1>

                    <motion.p
                        className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                    >
                        Mang đến trải nghiệm ẩm thực tiện lợi và chất lượng cho mọi nhà,
                        kết nối bạn với những hương vị tuyệt vời nhất
                    </motion.p>

                    <motion.div
                        className="flex items-center justify-center gap-4 mt-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.9 }}
                    >
                        <div className="w-20 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                        <div className="w-20 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </motion.div>
            </motion.section>

            {/* About Overview */}
            <motion.section
                className="py-24 bg-gradient-to-br from-slate-50 to-orange-50 relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="container mx-auto px-4">
                    <motion.div className="text-center mb-16" variants={fadeInUp}>
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                            <span className="text-orange-600 font-semibold tracking-wider uppercase text-sm">
                                Câu Chuyện
                            </span>
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        </div>

                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-orange-600 mb-8 font-montserrat leading-tight">
                            Chúng Tôi Là Ai?
                        </h2>
                    </motion.div>

                    <motion.div className="max-w-4xl mx-auto" variants={fadeInUp}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-orange-100">
                            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                                Platia là nền tảng đặt đồ ăn trực tuyến hàng đầu tại Việt Nam, được thành lập vào năm 2020 với mục tiêu mang đến sự tiện lợi và trải nghiệm ẩm thực tuyệt vời cho khách hàng.
                            </p>
                            <p className="text-xl text-gray-700 leading-relaxed">
                                Chúng tôi ra đời từ nhu cầu ngày càng cao về dịch vụ giao đồ ăn nhanh chóng, giúp bạn thưởng thức món ngon từ các nhà hàng yêu thích chỉ với vài cú click. Platia cung cấp dịch vụ đặt món online, giao hàng nhanh trong vòng 30 phút, và hỗ trợ đa dạng các loại hình ẩm thực từ món Việt truyền thống đến món ăn quốc tế.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Mission & Vision */}
            <motion.section
                className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div className="text-center mb-16" variants={fadeInUp}>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-8 font-montserrat leading-tight">
                            Sứ Mệnh & Tầm Nhìn
                        </h2>
                    </motion.div>

                    <motion.div className="max-w-4xl mx-auto" variants={fadeInUp}>
                        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-12">
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Sứ mệnh của chúng tôi là mang đến trải nghiệm ẩm thực chất lượng và tiện lợi cho mọi người, mọi lúc, mọi nơi. Chúng tôi cam kết kết nối khách hàng với những món ăn ngon nhất, đảm bảo sự hài lòng tuyệt đối.
                            </p>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Trong tương lai, Platia hướng tới việc trở thành nền tảng đặt đồ ăn số 1 tại Đông Nam Á, mở rộng dịch vụ đến nhiều thành phố hơn và không ngừng cải tiến để phục vụ khách hàng tốt hơn.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Core Values */}
            <motion.section
                className="py-24 bg-gradient-to-br from-orange-50 to-amber-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="container mx-auto px-4">
                    <motion.div className="text-center mb-16" variants={fadeInUp}>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-8 font-montserrat leading-tight">
                            Giá Trị Cốt Lõi
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
                        variants={staggerContainer}
                    >
                        {[
                            {
                                title: "Uy Tín",
                                description: "Luôn đặt sự hài lòng của khách hàng lên hàng đầu.",
                                icon: "🏆",
                                gradient: "from-blue-500 to-cyan-500"
                            },
                            {
                                title: "Tốc Độ",
                                description: "Giao hàng nhanh chóng trong 30 phút hoặc ít hơn.",
                                icon: "⚡",
                                gradient: "from-yellow-500 to-orange-500"
                            },
                            {
                                title: "Chất Lượng",
                                description: "Món ăn luôn tươi ngon, đảm bảo tiêu chuẩn vệ sinh.",
                                icon: "✨",
                                gradient: "from-green-500 to-emerald-500"
                            },
                            {
                                title: "Thân Thiện",
                                description: "Hỗ trợ khách hàng tận tâm 24/7.",
                                icon: "❤️",
                                gradient: "from-pink-500 to-red-500"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                            >
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100 group-hover:shadow-2xl transition-all duration-300">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Achievements */}
            <motion.section
                className="py-24 bg-gradient-to-br from-slate-900 to-gray-900 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div className="text-center mb-16" variants={fadeInUp}>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-8 font-montserrat leading-tight">
                            Thành Tựu Của Chúng Tôi
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                    >
                        {[
                            { number: "10.000+", text: "Khách hàng tin tưởng và sử dụng dịch vụ." },
                            { number: "150+", text: "Đối tác nhà hàng trên toàn quốc." },
                            { number: "5", text: "Thành phố lớn đã có mặt." }
                        ].map((achievement, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-8 bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-4">
                                    {achievement.number}
                                </h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {achievement.text}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Contact Section */}
            <motion.section
                className="py-24 bg-gradient-to-br from-orange-50 to-amber-50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
            >
                <div className="container mx-auto px-4">
                    <motion.div className="text-center mb-16" variants={fadeInUp}>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-8 font-montserrat leading-tight">
                            Liên Hệ Với Chúng Tôi
                        </h2>
                    </motion.div>

                    <motion.div className="max-w-3xl mx-auto" variants={fadeInUp}>
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-orange-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">📍</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Địa chỉ:</p>
                                        <p className="text-gray-600">123 Đường Ẩm Thực, Quận 1, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">📞</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Hotline:</p>
                                        <p className="text-gray-600">1900 1234</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">✉️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Email:</p>
                                        <p className="text-gray-600">support@platia.vn</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xl">🌐</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Mạng xã hội:</p>
                                        <div className="flex gap-3 mt-2">
                                            <motion.a
                                                href="https://facebook.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                                </svg>
                                            </motion.a>
                                            <motion.a
                                                href="https://zalo.me"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-300"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="font-bold text-sm">Z</span>
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}

export default About;