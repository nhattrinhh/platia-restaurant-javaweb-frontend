import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            rating: 5,
            text: 'Đặt món ăn qua website thật tiện lợi! Giao hàng nhanh, món ăn nóng hổi và đúng như mô tả. Chắc chắn sẽ tiếp tục ủng hộ!',
            avatar: '/images/avatar/avatar1.jpg',
        },
        {
            id: 2,
            name: 'Trần Thanh B',
            rating: 5,
            text: 'Mình đã thử nhiều món từ app này, từ pizza đến cơm tấm, đều ngon tuyệt! Giao diện dễ dùng và có nhiều ưu đãi hấp dẫn.',
            avatar: '/images/avatar/avatar2.png',
        },
        {
            id: 3,
            name: 'Lê Thị C',
            rating: 4.5,
            text: 'Combo gà rán giao đúng giờ, đồ ăn tươi ngon, đóng gói cẩn thận. Chỉ mong có thêm nhiều món mới để thử trong tương lai!',
            avatar: '/images/avatar/avatar3.jpg',
        },
    ];

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    return (
        <motion.section
            className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                        <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            Ý kiến khách hàng
                            <Star className="w-4 h-4" />
                        </span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                    </div>
                    <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat leading-snug">
                        Khách Hàng Nói Gì Về Chúng Tôi
                    </h2>
                    <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Nghe những chia sẻ chân thực từ khách hàng đã trải nghiệm dịch vụ đặt món ăn của chúng tôi!
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] hover:border-orange-500 transition-all duration-300 group relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <div className="absolute top-4 left-4 text-[2.5rem] text-orange-500 opacity-20 font-serif select-none pointer-events-none">
                                “
                            </div>
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-500 group-hover:shadow-lg group-hover:-rotate-6 group-hover:scale-105 transition-all duration-500">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                />
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center gap-1 mb-4 text-orange-500 text-lg">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(testimonial.rating) ? 'fill-current' : i < testimonial.rating ? 'fill-current text-opacity-50' : 'fill-none'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-600 italic text-base leading-relaxed mb-4 min-h-[4.5rem]">
                                    {testimonial.text}
                                </p>
                                <h4 className="text-orange-600 font-bold text-lg">{testimonial.name}</h4>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Testimonials;