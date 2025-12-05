import { Route, Routes, useLocation } from 'react-router-dom';
import { PublicPage, PrivatePage } from './router';
import ScrollToTop from './components/OtherComponent/ScrollToTop';
import { CartProvider } from '../src/Context/CartContext';
import Cart from '../src/components/Layout/DefautLayout/UserLayout/Cart';
import Chatbot from '../src/components/Layout/DefautLayout/UserLayout/Chatbot';
import PrivateRoute from './components/PrivateRoute';
import { useState } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { Bot } from 'lucide-react';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const location = useLocation();

  // Ẩn nút giỏ hàng và chatbot trên các tuyến đường bắt đầu bằng /admin, /login, /register
  const isButtonHidden = location.pathname.startsWith('/admin') || ['/login', '/register'].includes(location.pathname);

  return (
    <CartProvider>
      <div className="relative">
        <ScrollToTop />

        {/* Nút mở giỏ hàng - ẩn trên các trang login, register và tất cả tuyến đường /admin */}
        {!isButtonHidden && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed top-4 right-4 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-200 z-40"
            aria-label="Mở giỏ hàng"
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        )}

        {/* Nút mở chatbot - ẩn trên các trang login, register và tất cả tuyến đường /admin */}
        {!isButtonHidden && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 z-50"
            aria-label="Mở chatbot"
          >
            <Bot className="w-7 h-7 animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-25 transition-opacity duration-300"></span>
          </button>
        )}

        {/* Giỏ hàng dạng sidebar */}
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Chatbot */}
        <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

        {/* Điều hướng các tuyến đường */}
        <Routes>
          {/* Tuyến đường công khai */}
          {PublicPage.map((page, index) => {
            const Page = page.component;
            const Layout = page.layout;

            return (
              <Route
                key={index}
                path={page.path}
                element={
                  Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}

          {/* Tuyến đường riêng tư (ADMIN) */}
          {PrivatePage.map((page, index) => (
            <Route
              key={index}
              path={page.path}
              element={<PrivateRoute component={page.component} layout={page.layout} />}
            />
          ))}
        </Routes>
      </div>
    </CartProvider>
  );
}

export default App;