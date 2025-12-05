import { useEffect, useState } from "react";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import {
  getProducts,
  getProductTypes,
  getCategories,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/api/productService";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    img: "",
    productTypeId: "",
    productTypeName: "",
    status: "AVAILABLE",
    categoryId: "",
    categoryName: "",
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageToShow, setImageToShow] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7; // 7 records per page

  const token = localStorage.getItem("token");
  const baseImagePath = "http://localhost:5173/images/Product/";

  // Lấy danh sách sản phẩm, loại sản phẩm và danh mục từ backend
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Vui lòng đăng nhập với vai trò ADMIN.");
        setLoading(false);
        return;
      }

      try {
        // Lấy danh sách sản phẩm
        const productsData = await getProducts();
        const enrichedProducts = productsData.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || "",
          originalPrice: product.originalPrice,
          discountedPrice: product.discountedPrice || 0,
          img: product.img || "/images/Product/placeholder.jpg",
          discount: calculateDiscount(
            product.originalPrice,
            product.discountedPrice || 0
          ),
          productTypeId: product.productTypeId,
          productTypeName: product.productTypeName || "",
          status: product.status || "AVAILABLE",
          categoryId: product.categoryId,
          categoryName: product.categoryName || "",
        }));
        setProducts(enrichedProducts);

        // Lấy danh sách productTypes
        const productTypesData = await getProductTypes();
        setProductTypes(productTypesData);

        // Lấy danh sách categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        setError(null);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Tính toán discount
  const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice || originalPrice <= 0)
      return "Giảm 0%";
    const discountPercent = (
      ((originalPrice - discountedPrice) / originalPrice) *
      100
    ).toFixed(0);
    return `Giảm ${discountPercent}%`;
  };

  // Mở modal thêm/chỉnh sửa
  const handleOpenModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    if (type === "edit" && product) {
      setForm({
        name: product.name,
        description: product.description || "",
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        img:
          product.img && product.img.startsWith(baseImagePath)
            ? product.img.replace(baseImagePath, "")
            : product.img,
        productTypeId: product.productTypeId || "",
        productTypeName: product.productTypeName || "",
        status: product.status || "AVAILABLE",
        categoryId: product.categoryId || "",
        categoryName: product.categoryName || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        originalPrice: "",
        discountedPrice: "",
        img: "",
        productTypeId: "",
        productTypeName: "",
        status: "AVAILABLE",
        categoryId: "",
        categoryName: "",
      });
    }
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setError(null);
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "originalPrice" || name === "discountedPrice"
          ? parseFloat(value) || ""
          : value,
      ...(name === "productTypeId" && {
        productTypeName:
          productTypes.find((pt) => pt.id === parseInt(value))?.name || "",
      }),
      ...(name === "categoryId" && {
        categoryName:
          categories.find((cat) => cat.id === parseInt(value))?.name || "",
      }),
    }));
  };

  // Mở modal xem ảnh lớn
  const handleShowImage = (img) => {
    setImageToShow(img || "/images/Product/placeholder.jpg");
    setShowImageModal(true);
  };

  // Đóng modal xem ảnh
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setImageToShow(null);
  };

  // Thêm hoặc chỉnh sửa sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.originalPrice ||
      !form.productTypeId ||
      !form.status
    ) {
      setError(
        "Vui lòng nhập đầy đủ thông tin bắt buộc (tên, giá gốc, loại món ăn, trạng thái)."
      );
      return;
    }
    const originalPrice = parseFloat(form.originalPrice);
    const discountedPrice = parseFloat(form.discountedPrice) || 0;
    if (originalPrice < 0 || discountedPrice < 0) {
      setError("Giá phải là số dương.");
      return;
    }
    if (discountedPrice > originalPrice) {
      setError("Giá khuyến mãi không được lớn hơn giá gốc.");
      return;
    }
    const imageUrl = form.img
      ? form.img.startsWith("http")
        ? form.img
        : `${baseImagePath}${form.img}`
      : null;
    if (imageUrl && imageUrl.startsWith("http") && !isValidUrl(imageUrl)) {
      setError("URL hình ảnh không hợp lệ.");
      return;
    }
    if (
      imageUrl &&
      !imageUrl.startsWith("http") &&
      !form.img.match(/\.(jpg|jpeg|png|gif)$/i)
    ) {
      setError("Tên tệp hình ảnh phải có đuôi .jpg, .jpeg, .png hoặc .gif.");
      return;
    }

    // Xác nhận lưu với SweetAlert2
    const confirmResult = await Swal.fire({
      title:
        modalType === "add"
          ? "Xác nhận thêm sản phẩm"
          : "Xác nhận chỉnh sửa sản phẩm",
      text: `Bạn có chắc chắn muốn ${
        modalType === "add" ? "thêm" : "lưu thay đổi cho"
      } sản phẩm này?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5", // Indigo-600
      cancelButtonColor: "#6B7280", // Gray-500
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        originalPrice,
        discountedPrice,
        discount: (
          ((originalPrice - discountedPrice) / originalPrice) *
          100
        ).toFixed(2),
        productTypeId: parseInt(form.productTypeId),
        productTypeName: form.productTypeName || null,
        img: imageUrl,
        status: form.status,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        categoryName: form.categoryName || null,
      };

      if (modalType === "add") {
        const newProduct = await createProduct(token, payload);
        setProducts([
          ...products,
          {
            id: newProduct.id,
            name: newProduct.name,
            description: newProduct.description || "",
            originalPrice: newProduct.originalPrice,
            discountedPrice: newProduct.discountedPrice || 0,
            img: newProduct.img || "/images/Product/placeholder.jpg",
            discount: calculateDiscount(
              newProduct.originalPrice,
              newProduct.discountedPrice || 0
            ),
            productTypeId: newProduct.productTypeId,
            productTypeName: newProduct.productTypeName || "",
            status: newProduct.status || "AVAILABLE",
            categoryId: newProduct.categoryId,
            categoryName: newProduct.categoryName || "",
          },
        ]);
        toast.success("Thêm món ăn thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else if (modalType === "edit" && selectedProduct) {
        const updatedProduct = await updateProduct(
          token,
          selectedProduct.id,
          payload
        );
        setProducts(
          products.map((p) =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  name: updatedProduct.name,
                  description: updatedProduct.description || "",
                  originalPrice: updatedProduct.originalPrice,
                  discountedPrice: updatedProduct.discountedPrice || 0,
                  img: updatedProduct.img || "/images/Product/placeholder.jpg",
                  discount: calculateDiscount(
                    updatedProduct.originalPrice,
                    updatedProduct.discountedPrice || 0
                  ),
                  productTypeId: updatedProduct.productTypeId,
                  productTypeName: updatedProduct.productTypeName || "",
                  status: updatedProduct.status || "AVAILABLE",
                  categoryId: updatedProduct.categoryId,
                  categoryName: updatedProduct.categoryName || "",
                }
              : p
          )
        );
        toast.success("Cập nhật món ăn thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
      handleCloseModal();
      setCurrentPage(1); // Reset to first page after adding/editing
    } catch (err) {
      setError(err.message || "Không thể lưu món ăn.");
      toast.error(err.message || "Không thể lưu món ăn.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error(err);
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!token) {
      setError("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Xác nhận xóa món ăn",
      text: "Bạn có chắc chắn muốn xóa món ăn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Red-500
      cancelButtonColor: "#6B7280", // Gray-500
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteProduct(token, id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Xóa món ăn thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setError(null);
      // Adjust current page if necessary
      if (currentProducts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message || "Không thể xóa món ăn.");
      toast.error(err.message || "Không thể xóa món ăn.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error(err);
    }
  };

  // Tìm kiếm sản phẩm theo tên
  const handleSearch = async () => {
    if (!token) {
      setError("Vui lòng đăng nhập để thực hiện tìm kiếm.");
      return;
    }

    try {
      const productsData = await searchProducts(token, search);
      const enrichedProducts = productsData.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice || 0,
        img: product.img || "/images/Product/placeholder.jpg",
        discount: calculateDiscount(
          product.originalPrice,
          product.discountedPrice || 0
        ),
        productTypeId: product.productTypeId,
        productTypeName: product.productTypeName || "",
        status: product.status || "AVAILABLE",
        categoryId: product.categoryId,
        categoryName: product.categoryName || "",
      }));
      setProducts(enrichedProducts);
      setError(null);
      toast.success("Tìm kiếm món ăn thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setCurrentPage(1); // Reset to first page after search
    } catch (err) {
      setError(err.message || "Không thể tìm kiếm món ăn.");
      toast.error(err.message || "Không thể tìm kiếm món ăn.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error(err);
    }
  };

  // Xóa bộ lọc tìm kiếm và tải lại danh sách sản phẩm
  const handleClearFilter = async () => {
    setSearch("");
    if (!token) {
      setError("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    try {
      const productsData = await getProducts();
      const enrichedProducts = productsData.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice || 0,
        img: product.img || "/images/Product/placeholder.jpg",
        discount: calculateDiscount(
          product.originalPrice,
          product.discountedPrice || 0
        ),
        productTypeId: product.productTypeId,
        productTypeName: product.productTypeName || "",
        status: product.status || "AVAILABLE",
        categoryId: product.categoryId,
        categoryName: product.categoryName || "",
      }));
      setProducts(enrichedProducts);
      setError(null);
      toast.success("Đã xóa bộ lọc và tải lại danh sách món ăn", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setCurrentPage(1); // Reset to first page after clearing filter
    } catch (err) {
      setError(err.message || "Không thể tải danh sách món ăn.");
      toast.error(err.message || "Không thể tải danh sách món ăn.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error(err);
    }
  };

  // Kiểm tra URL hợp lệ
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">
          Quản lý Thực Đơn
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              className="w-full pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="Tìm kiếm theo tên món ăn..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {search && (
              <FaTimes
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-red-500"
                onClick={handleClearFilter}
              />
            )}
          </div>
          <button
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 text-sm sm:text-base whitespace-nowrap"
            onClick={() => handleOpenModal("add")}
          >
            <FaPlus className="mr-2" /> Thêm món ăn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {currentProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-6">
            Không có món ăn phù hợp
          </div>
        ) : (
          currentProducts.map((p, idx) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-40 sm:h-48 object-cover cursor-pointer"
                onError={(e) =>
                  (e.target.src = "/images/Product/placeholder.jpg")
                }
                onClick={() => handleShowImage(p.img)}
              />
              <div className="p-3 sm:p-4">
                <h4 className="text-base sm:text-lg font-semibold text-indigo-800 mb-1 line-clamp-2">
                  {p.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">
                  {p.productTypeName || "Không có"}
                </p>
                <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    {p.originalPrice.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-sm sm:text-base text-indigo-700 font-bold">
                    {p.discountedPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {p.discount}
                </span>
              </div>
              <div className="flex justify-end gap-2 p-3 sm:p-4 border-t">
                <button
                  className="p-2 sm:p-2.5 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
                  onClick={() => handleOpenModal("edit", p)}
                  aria-label="Chỉnh sửa"
                >
                  <FaEdit className="text-sm sm:text-base" />
                </button>
                <button
                  className="p-2 sm:p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  onClick={() => handleDelete(p.id)}
                  aria-label="Xóa"
                >
                  <FaTrash className="text-sm sm:text-base" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 gap-3 sm:gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Trước
          </button>

          <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Hiển thị tối đa 5 số trang trên desktop, ít hơn trên mobile
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span
                    key={page}
                    className="px-1 sm:px-2 text-gray-500 text-sm sm:text-base"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Sau
          </button>
        </div>
      )}

      {/* Hiển thị thông tin phân trang */}
      {products.length > 0 && (
        <div className="text-center mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm px-2">
          Hiển thị {indexOfFirstProduct + 1} -{" "}
          {Math.min(indexOfLastProduct, products.length)} trong tổng số{" "}
          {products.length} sản phẩm
        </div>
      )}

      {/* Modal xem ảnh lớn */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={imageToShow}
              alt="Product"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = "/images/Product/placeholder.jpg";
              }}
            />
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-xl sm:text-2xl font-bold bg-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-700 transition-all duration-200"
              onClick={handleCloseImageModal}
              aria-label="Đóng"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Modal thêm/chỉnh sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 w-full max-w-4xl shadow-2xl backdrop-blur-lg my-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {modalType === "add" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
            </h3>
            {error && (
              <div className="text-red-500 mb-4 text-center text-sm sm:text-base">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tên món ăn *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên món ăn"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Giá gốc *
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.originalPrice}
                    onChange={handleChange}
                    required
                    placeholder="Nhập giá gốc"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Giá khuyến mãi
                  </label>
                  <input
                    type="number"
                    name="discountedPrice"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.discountedPrice}
                    onChange={handleChange}
                    placeholder="Nhập giá khuyến mãi"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Loại món ăn *
                  </label>
                  <select
                    name="productTypeId"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.productTypeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn loại món ăn</option>
                    {productTypes.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Trạng thái *
                  </label>
                  <select
                    name="status"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="AVAILABLE">Có sẵn</option>
                    <option value="OUT_OF_STOCK">Hết hàng</option>
                    <option value="DISCONTINUED">Ngừng kinh doanh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Danh mục món ăn
                  </label>
                  <select
                    name="categoryId"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">Không có</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Hình ảnh
                  </label>
                  <input
                    type="text"
                    name="img"
                    className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    value={form.img}
                    onChange={handleChange}
                    placeholder="Nhập tên tệp hoặc URL"
                  />
                  {form.img && (
                    <img
                      src={
                        form.img.startsWith("http")
                          ? form.img
                          : `${baseImagePath}${form.img}`
                      }
                      alt="Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover mt-2 rounded"
                      onError={(e) => {
                        e.target.src = "/images/Product/placeholder.jpg";
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="mt-3 sm:mt-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả sản phẩm"
                  rows="4"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end mt-4 sm:mt-6 gap-2 sm:space-x-3 sm:space-x-0">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base order-1 sm:order-2"
                >
                  {modalType === "add" ? "Thêm mới" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;
