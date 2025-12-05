import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Filter, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, getProductTypes, getCategories } from '../../../services/api/productService';
import { useCart } from '../../../Context/CartContext';
import Cart from '../../../components/Layout/DefautLayout/UserLayout/Cart';
import ProductDetails from '../../../components/OtherComponent/ProductDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Menu() {
    const [products, setProducts] = useState([]);
    const [productTypes, setProductTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProductType, setSelectedProductType] = useState('Tất cả');
    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { addToCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productsData = await getProducts();
                const enrichedProducts = productsData.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    originalPrice: product.originalPrice,
                    discountedPrice: product.discountedPrice || product.originalPrice,
                    img: product.img || '/images/placeholder.jpg',
                    productTypeId: product.productTypeId,
                    productTypeName: product.productTypeName || 'Không có',
                    status: product.status || 'AVAILABLE',
                    categoryId: product.categoryId,
                    categoryName: product.categoryName || 'Không có',
                }));
                setProducts(enrichedProducts);
                setFilteredProducts(enrichedProducts);

                const productTypesData = await getProductTypes();
                setProductTypes(productTypesData);

                const categoriesData = await getCategories();
                setCategories(categoriesData);

                setError(null);
            } catch (err) {
                if (err.message === 'Vui lòng đăng nhập để xem thực đơn.') {
                    setError(err.message);
                    navigate('/login');
                } else {
                    setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                    console.error('Lỗi:', err);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        let result = [...products];
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            if (selectedProductType !== 'Tất cả') {
                result = result.filter(product =>
                    product.productTypeName.toLowerCase() === selectedProductType.toLowerCase()
                );
            }
            if (selectedCategory !== 'Tất cả') {
                result = result.filter(product =>
                    product.categoryName.toLowerCase() === selectedCategory.toLowerCase()
                );
            }
            if (selectedPriceRange !== 'Tất cả') {
                let min, max;
                if (selectedPriceRange === 'under50000') {
                    min = 0;
                    max = 50000;
                } else if (selectedPriceRange === 'over150000') {
                    min = 150000;
                    max = Infinity;
                } else {
                    [min, max] = selectedPriceRange.split('-').map(Number);
                }
                result = result.filter(product => {
                    const price = parseInt(product.discountedPrice);
                    return price >= min && price <= max;
                });
            }
        }
        setFilteredProducts(result);
    }, [searchQuery, selectedProductType, selectedCategory, selectedPriceRange, products]);

    const resetFilters = async () => {
        setSelectedProductType('Tất cả');
        setSelectedCategory('Tất cả');
        setSelectedPriceRange('Tất cả');
        try {
            const productsData = await getProducts();
            const enrichedProducts = productsData.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description || '',
                originalPrice: product.originalPrice,
                discountedPrice: product.discountedPrice || product.originalPrice,
                img: product.img || '/images/placeholder.jpg',
                productTypeId: product.productTypeId,
                productTypeName: product.productTypeName || 'Không có',
                status: product.status || 'AVAILABLE',
                categoryId: product.categoryId,
                categoryName: product.categoryName || 'Không có',
            }));
            setProducts(enrichedProducts);
            setFilteredProducts(enrichedProducts);
            setError(null);
        } catch (err) {
            setError('Không thể tải lại danh sách sản phẩm. Vui lòng thử lại sau.');
            console.error('Lỗi:', err);
        }
    };

    const priceRanges = [
        { value: 'Tất cả', label: 'Tất cả' },
        { value: 'under50000', label: 'Dưới 50.000' },
        { value: '50000-100000', label: '50.000-100.000' },
        { value: '100000-150000', label: '100.000-150.000' },
        { value: 'over150000', label: 'Trên 150.000' },
    ];

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const calculateDiscount = (originalPrice, discountedPrice) => {
        const origPrice = parseInt(originalPrice);
        const discPrice = parseInt(discountedPrice);
        if (origPrice === discPrice || origPrice <= 0) return 0;
        return Math.round(((origPrice - discPrice) / origPrice) * 100);
    };

    const orderNow = (product) => {
        console.log('Đặt ngay:', product);
        setIsModalOpen(false);
    };

    const openProductModal = (product) => {
        if (product.status === 'OUT_OF_STOCK' || product.status === 'DISCONTINUED') {
            toast.error(`Sản phẩm "${product.name}" hiện không thể mua vì ${product.status.toLowerCase() === 'out_of_stock' ? 'hết hàng' : 'ngừng kinh doanh'}.`);
            return;
        }
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Đang tải...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <motion.div
                    className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-500 text-lg font-medium">{error}</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <ToastContainer position="top-right" autoClose={3000} />
            <ProductDetails
                isOpen={isModalOpen}
                onClose={closeModal}
                product={selectedProduct}
                addToCart={addToCart}
                orderNow={orderNow}
                setIsCartOpen={setIsCartOpen}
            />
            <Cart isOpen={isCartOpen} onClose={toggleCart} />
            <motion.section
                className="py-16 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 shadow-lg relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                    <motion.div
                        className="flex items-center justify-center gap-4 mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.div
                            className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                            initial={{ width: 0 }}
                            animate={{ width: '4rem' }}
                            transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                        <span className="text-orange-600 font-medium text-sm tracking-[0.2em] uppercase">
                            Tuyển chọn hấp dẫn
                        </span>
                        <motion.div
                            className="w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                            initial={{ width: 0 }}
                            animate={{ width: '4rem' }}
                            transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                    </motion.div>
                    <div className="container mx-auto px-4 text-center">
                        <motion.h1
                            className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 mb-6 font-montserrat tracking-tight leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Thực Đơn
                        </motion.h1>
                        <motion.p
                            className="text-slate-600 text-xl text-center max-w-4xl mb-8 mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Khám phá những món ăn tuyệt vời được chế biến với tình yêu và sự tận tâm tại Platia
                        </motion.p>
                    </div>
                </div>
            </motion.section>
            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
                <section className="w-full lg:w-3/4">
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">Không có sản phẩm nào phù hợp.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => {
                                const discount = calculateDiscount(product.originalPrice, product.discountedPrice);
                                const isSealed = product.status === 'OUT_OF_STOCK' || product.status === 'DISCONTINUED';

                                return (
                                    <motion.div
                                        key={product.id}
                                        className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out border border-white/20 ${isSealed ? 'opacity-70' : 'hover:shadow-2xl hover:shadow-orange-200/40'}`}
                                        whileHover={{ scale: isSealed ? 1 : 1.02, y: isSealed ? 0 : -12 }}
                                    >
                                        {/* Hiệu ứng ánh sáng khi hover (chỉ áp dụng nếu không bị niêm phong) */}
                                        {!isSealed && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        )}

                                        {/* Hiệu ứng glow border (chỉ áp dụng nếu không bị niêm phong) */}
                                        {!isSealed && (
                                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                                        )}

                                        <div className="relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                                            {/* Hiệu ứng shimmer overlay (chỉ áp dụng nếu không bị niêm phong) */}
                                            {!isSealed && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                                            )}

                                            {/* Overlay niêm phong nếu bị OUT_OF_STOCK hoặc DISCONTINUED */}
                                            {isSealed && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-red-900/30 to-black/70 backdrop-blur-sm flex items-center justify-center z-20 animate-pulse">
                                                    <span className="text-white text-2xl font-bold uppercase tracking-widest drop-shadow-2xl relative px-6 py-3 bg-gradient-to-r from-red-600/90 to-red-700/90 rounded-xl border border-red-400/60 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-bounce">
                                                        {/* Hiệu ứng shimmer */}
                                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse rounded-xl"></span>

                                                        {/* Icon cảnh báo */}
                                                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></span>
                                                        <span className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-400 rounded-full animate-ping delay-500"></span>

                                                        {/* Text content */}
                                                        <span className="relative z-10 flex items-center gap-2">
                                                            {/* Warning icon */}
                                                            <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {product.status === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Ngừng kinh doanh'}
                                                        </span>

                                                        {/* Decorative particles */}
                                                        <span className="absolute top-1 left-1 w-1 h-1 bg-white/60 rounded-full animate-ping"></span>
                                                        <span className="absolute top-3 right-1 w-1 h-1 bg-white/40 rounded-full animate-ping delay-300"></span>
                                                        <span className="absolute bottom-1 right-3 w-1 h-1 bg-white/50 rounded-full animate-ping delay-700"></span>
                                                    </span>
                                                </div>
                                            )}

                                            {/* Badge giảm giá (chỉ áp dụng nếu không bị niêm phong) */}
                                            {discount > 0 && !isSealed && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                                                        Giảm {discount}%
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

                                            {/* Gradient overlay khi hover (chỉ áp dụng nếu không bị niêm phong) */}
                                            {!isSealed && (
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            )}
                                        </div>

                                        <div className={`relative p-8 ${isSealed ? 'bg-gray-800/30' : 'group-hover:bg-gradient-to-br group-hover:from-white/90 group-hover:to-orange-50/50'} transition-all duration-300`}>
                                            <motion.h3
                                                className="text-2xl font-bold text-gray-900 mb-4 transition-all duration-300 group-hover:text-orange-600 line-clamp-2"
                                                whileHover={{ x: isSealed ? 0 : 4 }}
                                            >
                                                {product.name}
                                            </motion.h3>

                                            <div className="flex justify-center items-center mb-4">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <motion.span
                                                            key={i}
                                                            className="text-lg"
                                                            whileHover={{ scale: isSealed ? 1 : 1.2, rotate: isSealed ? 0 : 5 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            {i < 4 ? '★' : '☆'}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-center items-center space-x-3 mb-4">
                                                {discount > 0 && !isSealed && (
                                                    <motion.p
                                                        className="text-gray-600 line-through text-lg group-hover:text-gray-500 transition-colors duration-300"
                                                        whileHover={{ scale: 0.95 }}
                                                    >
                                                        {parseInt(product.originalPrice).toLocaleString('vi-VN')} VNĐ
                                                    </motion.p>
                                                )}
                                                <motion.p
                                                    className="text-orange-600 font-bold text-xl group-hover:text-orange-500 transition-colors duration-300"
                                                    whileHover={{ scale: isSealed ? 1 : 1.05 }}
                                                >
                                                    {parseInt(product.discountedPrice).toLocaleString('vi-VN')} VNĐ
                                                </motion.p>
                                            </div>

                                            {discount > 0 && !isSealed && (
                                                <motion.p
                                                    className="text-sm text-orange-600 font-semibold mb-6 group-hover:text-orange-500 transition-colors duration-300"
                                                    whileHover={{ x: 2 }}
                                                >
                                                    Giảm {discount}%
                                                </motion.p>
                                            )}

                                            <motion.button
                                                onClick={() => openProductModal(product)}
                                                className={`relative inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-300 ${isSealed ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 hover:shadow-lg'} group-hover:shadow-xl transform ${isSealed ? '' : 'hover:scale-105'} overflow-hidden`}
                                                whileHover={{ scale: isSealed ? 1 : 1.05 }}
                                                whileTap={{ scale: isSealed ? 1 : 0.95 }}
                                                disabled={isSealed}
                                            >
                                                {/* Hiệu ứng wave khi hover button (chỉ áp dụng nếu không bị niêm phong) */}
                                                {!isSealed && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                                                )}

                                                <div className="relative flex items-center">
                                                    <motion.div
                                                        animate={{ rotate: [0, 360] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                        className={`group-hover:animate-spin ${isSealed ? 'text-gray-400' : ''}`}
                                                    >
                                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                                    </motion.div>
                                                    Đặt ngay
                                                    <motion.div
                                                        animate={{ x: [0, 4, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                        className={`group-hover:animate-bounce ${isSealed ? '' : 'ml-2'}`}
                                                    >
                                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                                    </motion.div>
                                                </div>
                                            </motion.button>
                                        </div>

                                        {/* Hiệu ứng particles khi hover (chỉ áp dụng nếu không bị niêm phong) */}
                                        {!isSealed && (
                                            <div className="absolute inset-0 pointer-events-none">
                                                <div className="absolute top-10 left-10 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-100"></div>
                                                <div className="absolute top-20 right-16 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-200"></div>
                                                <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300 delay-300"></div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>
                <motion.aside
                    className="w-full lg:w-1/4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-orange-100 sticky top-6 h-fit"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={sectionVariants}
                >
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-orange-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Bộ lọc</h2>
                        </div>
                        {(selectedProductType !== 'Tất cả' || selectedCategory !== 'Tất cả' || selectedPriceRange !== 'Tất cả') && (
                            <motion.button
                                onClick={resetFilters}
                                className="flex items-center text-sm text-red-500 hover:text-red-600 transition-colors duration-200 px-3 py-1 rounded-full hover:bg-red-50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Xóa bộ lọc
                            </motion.button>
                        )}
                    </div>
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Loại sản phẩm
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                onClick={() => setSelectedProductType('Tất cả')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedProductType === 'Tất cả'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Tất cả
                            </motion.button>
                            {productTypes.map((type) => (
                                <motion.button
                                    key={type.id}
                                    onClick={() => setSelectedProductType(type.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedProductType === type.name
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + type.id * 0.1 }}
                                >
                                    {type.name}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                            Danh mục
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <motion.button
                                onClick={() => setSelectedCategory('Tất cả')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === 'Tất cả'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Tất cả
                            </motion.button>
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.name
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + category.id * 0.1 }}
                                >
                                    {category.name}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-lg font-medium text-gray-700 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                            Khoảng giá
                        </h3>
                        <div className="space-y-3">
                            {priceRanges.map((range, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setSelectedPriceRange(range.value)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-between ${selectedPriceRange === range.value
                                        ? 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 font-semibold shadow-md border border-orange-200'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                                        }`}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <span>{range.label}</span>
                                    {selectedPriceRange === range.value && (
                                        <motion.span
                                            className="text-orange-500 font-bold"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </motion.aside>
            </div>
        </div>
    );
}

export default Menu;