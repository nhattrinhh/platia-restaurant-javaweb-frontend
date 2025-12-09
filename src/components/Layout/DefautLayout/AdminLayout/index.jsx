import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function AdminLayout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            const mobile = width < 768;
            const tablet = width >= 768 && width < 1024;
            const desktop = width >= 1024;
            
            setIsMobile(mobile);
            setIsTablet(tablet);
            
            // Trên mobile/tablet: sidebar mặc định đóng (drawer), trên desktop: mặc định mở
            if (mobile || tablet) {
                setSidebarOpen(false);
            } else if (desktop) {
                // Khi chuyển sang desktop, đảm bảo sidebar mở
                setSidebarOpen(false); // Không dùng sidebarOpen trên desktop
            }
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile || isTablet) {
            // Trên mobile/tablet: toggle drawer
            setSidebarOpen(!sidebarOpen);
        } else {
            // Trên desktop: toggle collapsed state
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const closeSidebar = () => {
        if (isMobile || isTablet) {
            setSidebarOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="admin-layout flex min-h-screen relative">
            {/* Backdrop overlay cho mobile/tablet */}
            {(isMobile || isTablet) && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    ${isMobile || isTablet 
                        ? `fixed top-0 left-0 h-screen z-50 transform transition-transform duration-300 ease-in-out ${
                            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                          }`
                        : 'sticky top-0 h-screen z-30'
                    }
                    bg-white text-gray-800 shadow-lg
                    ${sidebarCollapsed && !isMobile && !isTablet ? 'w-20' : 'w-64 lg:min-w-[280px] lg:max-w-[300px]'}
                `}
            >
                <Sidebar 
                    collapsed={sidebarCollapsed && !isMobile && !isTablet} 
                    setCollapsed={setSidebarCollapsed} 
                    onLogout={handleLogout}
                    onClose={closeSidebar}
                    isMobile={isMobile}
                    isTablet={isTablet}
                />
            </aside>

            {/* Main content */}
            <div className="admin-main flex-grow flex flex-col w-full lg:w-auto">
                <Header onToggleSidebar={toggleSidebar} />
                <main
                    className="flex-grow p-3"
                    style={{
                        background: '#f8f9fa',
                        overflowY: 'auto',
                        minHeight: 0,
                        maxHeight: 'calc(100vh - 64px - 64px)', // header + footer (đồng bộ h-16 = 64px)
                    }}
                >
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default AdminLayout;