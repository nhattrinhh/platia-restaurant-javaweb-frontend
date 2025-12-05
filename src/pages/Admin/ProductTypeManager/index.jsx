import { useEffect, useState, useMemo } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import {
  getProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
} from "../../../services/api/productTypeService";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductTypeManager() {
  const [productTypes, setProductTypes] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [modalType, setModalType] = useState("add"); // 'add' | 'edit'
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  // Lấy danh sách loại sản phẩm từ backend
  useEffect(() => {
    const fetchProductTypes = async () => {
      if (!token) {
        setError("Vui lòng đăng nhập với vai trò ADMIN.");
        setLoading(false);
        return;
      }

      try {
        const productTypesData = await getProductTypes(token);
        setProductTypes(productTypesData);
        setError(null);
      } catch (err) {
        setError(err.message || "Không thể tải dữ liệu.");
        toast.error(err.message || "Không thể tải dữ liệu.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductTypes();
  }, [token]);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Mở modal thêm/chỉnh sửa
  const handleOpenModal = (type, productType = null) => {
    setModalType(type);
    setSelectedId(productType?.id || null);
    setForm({ name: productType?.name || "" });
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedId(null);
    setForm({ name: "" });
    setError(null);
  };

  // Thêm hoặc chỉnh sửa loại sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.name.trim() === "") {
      setError("Tên loại món ăn không được để trống.");
      return;
    }

    // Xác nhận lưu với SweetAlert2
    const confirmResult = await Swal.fire({
      title:
        modalType === "add"
          ? "Xác nhận thêm loại món ăn"
          : "Xác nhận chỉnh sửa loại món ăn",
      text: `Bạn có chắc chắn muốn ${
        modalType === "add" ? "thêm" : "lưu thay đổi cho"
      } loại món ăn này?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5", // Indigo-600
      cancelButtonColor: "#6B7280", // Gray-500
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      if (modalType === "add") {
        const newProductType = await createProductType(token, {
          name: form.name,
        });
        setProductTypes([...productTypes, newProductType]);
        toast.success("Thêm loại món ăn thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } else if (modalType === "edit" && selectedId) {
        const updatedProductType = await updateProductType(token, selectedId, {
          name: form.name,
        });
        setProductTypes(
          productTypes.map((pt) =>
            pt.id === selectedId ? updatedProductType : pt
          )
        );
        toast.success("Cập nhật loại món ăn thành công!", {
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
    } catch (err) {
      setError(err.message || "Không thể lưu loại món ăn.");
      toast.error(err.message || "Không thể lưu loại món ăn.", {
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

  // Xóa loại sản phẩm
  const handleDelete = async (id) => {
    if (!token) {
      setError("Vui lòng đăng nhập để thực hiện hành động này.");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Xác nhận xóa loại món ăn",
      text: "Bạn có chắc chắn muốn xóa loại món ăn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Red-500
      cancelButtonColor: "#6B7280", // Gray-500
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await deleteProductType(token, id);
      const updatedProductTypes = productTypes.filter((pt) => pt.id !== id);
      setProductTypes(updatedProductTypes);
      toast.success("Xóa loại món ăn thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setError(null);
      // Reset to first page if current page becomes empty
      const filteredAfterDelete = searchQuery.trim()
        ? updatedProductTypes.filter((pt) =>
            pt.name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
          )
        : updatedProductTypes;
      if (filteredAfterDelete.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message || "Không thể xóa loại món ăn.");
      toast.error(err.message || "Không thể xóa loại món ăn.", {
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

  // Filter product types based on search query
  const filteredProductTypes = useMemo(() => {
    if (!searchQuery.trim()) {
      return productTypes;
    }
    const query = searchQuery.toLowerCase().trim();
    return productTypes.filter((pt) => pt.name?.toLowerCase().includes(query));
  }, [productTypes, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProductTypes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProductTypes = filteredProductTypes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="container mx-auto p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ToastContainer />
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Search Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-full lg:w-80" : "w-0 lg:w-0"
          } transition-all duration-300 ease-in-out overflow-hidden lg:overflow-visible`}
        >
          <div
            className={`bg-white rounded-xl shadow-lg p-4 lg:p-6 lg:sticky lg:top-6 h-fit ${
              isSidebarOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full lg:translate-x-0"
            } transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-indigo-900 flex items-center">
                <FaSearch className="mr-2" /> Tìm kiếm
              </h3>
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Đóng sidebar"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Tìm theo tên loại món ăn..."
                  className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Xóa tìm kiếm"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-indigo-900 font-medium">
                Tìm thấy:{" "}
                <span className="text-indigo-600 font-bold">
                  {filteredProductTypes.length}
                </span>{" "}
                kết quả
              </p>
            </div>

            <div className="hidden lg:block text-sm text-gray-600">
              <p className="mb-2 font-medium">Hướng dẫn tìm kiếm:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Tìm theo tên loại món ăn</li>
                <li>Tìm kiếm không phân biệt hoa thường</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                  aria-label="Mở sidebar"
                >
                  <FaSearch />
                </button>
              )}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 tracking-tight">
                Quản lý Loại Món Ăn
              </h2>
            </div>
            <button
              onClick={() => handleOpenModal("add")}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <FaPlus className="mr-2" /> Thêm loại món ăn
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-100 text-indigo-900">
                    <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">
                      #
                    </th>
                    <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">
                      Tên loại món ăn
                    </th>
                    <th className="p-3 sm:p-4 text-left font-semibold text-xs sm:text-sm">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProductTypes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center text-gray-500 py-6"
                      >
                        {searchQuery
                          ? `Không tìm thấy kết quả cho "${searchQuery}"`
                          : "Không có loại món ăn nào"}
                      </td>
                    </tr>
                  ) : (
                    currentProductTypes.map((pt, index) => (
                      <tr
                        key={pt.id}
                        className="hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="p-3 sm:p-4 border-t border-gray-200 text-xs sm:text-sm">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="p-3 sm:p-4 border-t border-gray-200 text-xs sm:text-sm">
                          {pt.name}
                        </td>
                        <td className="p-3 sm:p-4 border-t border-gray-200">
                          <div className="flex space-x-2 sm:space-x-3">
                            <button
                              onClick={() => handleOpenModal("edit", pt)}
                              className="p-2 bg-indigo-500 text-white rounded-full shadow-sm hover:bg-indigo-600 transition-all duration-200"
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(pt.id)}
                              className="p-2 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-all duration-200"
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredProductTypes.length > itemsPerPage && (
              <div className="flex flex-wrap justify-center items-center gap-2 py-4 px-2 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Trước
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl backdrop-blur-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {modalType === "add"
                ? "Thêm loại món ăn"
                : "Chỉnh sửa loại món ăn"}
            </h3>
            {error && (
              <div className="text-red-500 mb-4 text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên loại món ăn *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  required
                  placeholder="Nhập tên loại món ăn"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
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

export default ProductTypeManager;
