import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaSignOutAlt,
  FaList,
  FaTag,
  FaNewspaper,
  FaCalendarCheck,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const menu = [
  {
    label: "Trang chủ",
    icon: <FaTachometerAlt className="w-5 h-5" />,
    path: "/admin",
  },
  {
    label: "Quản lý người dùng",
    icon: <FaUsers className="w-5 h-5" />,
    path: "/admin/user",
  },
  {
    label: "Quản lý thực đơn",
    icon: <FaBox className="w-5 h-5" />,
    path: "/admin/products",
  },
  {
    label: "Quản lý loại món ăn",
    icon: <FaList className="w-5 h-5" />,
    path: "/admin/product-types",
  },
  {
    label: "Quản lý danh mục món ăn",
    icon: <FaTag className="w-5 h-5" />,
    path: "/admin/categories",
  },
  {
    label: "Quản lý đơn hàng",
    icon: <FaShoppingCart className="w-5 h-5" />,
    path: "/admin/orders",
  },
  {
    label: "Quản lý tin tức",
    icon: <FaNewspaper className="w-5 h-5" />,
    path: "/admin/news",
  },
  {
    label: "Quản lý đặt bàn",
    icon: <FaCalendarCheck className="w-5 h-5" />,
    path: "/admin/bookings",
  },
];

function Sidebar({ collapsed, setCollapsed, onLogout, onClose, isMobile, isTablet }) {
  const location = useLocation();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
    if (isMobile || isTablet) {
      onClose();
    }
  };

  const handleLinkClick = () => {
    // Đóng sidebar trên mobile/tablet khi click vào menu item
    if (isMobile || isTablet) {
      onClose();
    }
  };

  return (
    <aside
      className={`bg-white text-gray-800 h-screen flex flex-col shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-full"
      }`}
    >
      {/* Logo và nút toggle */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        {!collapsed && (
          <span className="font-bold text-xl sm:text-2xl text-indigo-600 tracking-tight truncate">
            Platia Admin
          </span>
        )}
        <div className="flex items-center gap-2">
          {/* Nút đóng trên mobile/tablet */}
          {(isMobile || isTablet) && (
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 lg:hidden"
              aria-label="Đóng sidebar"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
          {/* Nút toggle trên desktop */}
          {!isMobile && !isTablet && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200"
              aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              <FaBars className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-grow overflow-y-auto py-2">
        <ul className="flex flex-col">
          {menu.map((item) => (
            <li className="my-1" key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center px-4 sm:px-6 py-3 mx-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith(item.path)
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                }`}
                aria-current={
                  location.pathname.startsWith(item.path) ? "page" : undefined
                }
                aria-label={item.label}
              >
                <span className={`${collapsed ? "mx-auto" : "mr-3"} flex-shrink-0`}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Nút đăng xuất */}
      <div className="border-t border-gray-200 p-4 sm:px-6 flex items-center flex-shrink-0">
        <button
          onClick={handleLogoutClick}
          className={`flex items-center w-full py-2.5 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200
            ${collapsed ? "justify-center px-0" : "justify-start px-4"}`}
          aria-label="Đăng xuất"
        >
          <FaSignOutAlt
            className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
              collapsed ? "" : "mr-3"
            }`}
          />
          {!collapsed && <span className="text-sm">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
