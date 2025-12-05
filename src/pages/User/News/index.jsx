import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, X, Calendar, ArrowRight } from 'lucide-react';
import { getNews } from '../../../services/api/newsService';

function News() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy danh sách tin tức từ API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsData = await getNews();
                // Ánh xạ dữ liệu từ API để khớp với cấu trúc giao diện
                const enrichedNews = newsData.map(news => ({
                    id: news.id || Date.now() + Math.random(),
                    title: news.title || 'Tin tức không tên',
                    img: news.imageUrl || '/images/News/placeholder.jpg',
                    summary: news.description ? news.description.substring(0, 100) + '...' : '',
                    date: new Date(news.timestamp).toLocaleDateString('vi-VN'),
                }));
                setNewsList(enrichedNews);
                setError(null);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Tối ưu hóa danh sách tin tức
    const optimizedNewsList = useMemo(() => newsList, [newsList]);

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
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
                        <p className="text-slate-700 text-xl font-medium">Đang tải tin tức...</p>
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
                        onClick={() => fetchNews()}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg transform hover:scale-105"
                    >
                        Thử lại
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.section
            className="py-20 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden"
            id="news"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-orange-600 font-semibold text-sm tracking-[0.3em] uppercase px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-orange-100">
                            Tin tức mới nhất
                        </span>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>

                    <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-8 font-montserrat tracking-tight leading-tight">
                        Tin Tức Platia
                    </h2>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-slate-700 text-2xl leading-relaxed mb-6">
                            Cập nhật những tin tức mới nhất từ Platia
                        </p>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Khám phá sự kiện, ưu đãi và món ăn hấp dẫn cùng chúng tôi!
                        </p>
                    </div>
                </motion.div>

                {optimizedNewsList.length === 0 ? (
                    <motion.div
                        className="text-center py-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <Newspaper className="w-16 h-16 text-gray-400" />
                        </div>
                        <div className="backdrop-blur-sm bg-white/60 rounded-3xl p-10 max-w-md mx-auto shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Chưa có tin tức</h3>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Hiện tại chưa có tin tức nào. Hãy quay lại sau nhé!
                            </p>
                            <Link
                                to="/news"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg transform hover:scale-105 group"
                            >
                                <Newspaper className="w-5 h-5 mr-2" />
                                Xem thêm tin tức
                                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {optimizedNewsList.map((news, index) => (
                            <motion.div
                                key={news.id}
                                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out border border-white/20 hover:shadow-2xl"
                                whileHover={{ scale: 1.02, y: -12 }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                                    <motion.img
                                        src={news.img}
                                        alt={news.title}
                                        className="w-full h-56 object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                                        loading="lazy"
                                        onError={(e) => { e.target.src = '/images/News/placeholder.jpg'; }}
                                    />

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                        <Calendar className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <p className="text-orange-600 text-sm font-medium">{news.date}</p>
                                    </div>

                                    <motion.h3
                                        className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-orange-600 line-clamp-2"
                                        whileHover={{ x: 4 }}
                                    >
                                        {news.title}
                                    </motion.h3>

                                    <p className="text-gray-600 mb-8 leading-relaxed line-clamp-3">
                                        {news.summary}
                                    </p>

                                    <Link
                                        to={`/news/${news.id}`}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold transition-all duration-300 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg group-hover:shadow-xl transform hover:scale-105 group/button"
                                    >
                                        <motion.div
                                            className="flex items-center"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Newspaper className="w-5 h-5 mr-2" />
                                            Xem chi tiết
                                            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover/button:translate-x-1" />
                                        </motion.div>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.section>
    );
}

export default News;