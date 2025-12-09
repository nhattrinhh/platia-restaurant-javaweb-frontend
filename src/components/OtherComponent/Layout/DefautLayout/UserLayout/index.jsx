import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function UserLayout({ children }) {
    const location = useLocation();
    const hideHeaderAndFooter = ['/login', '/register'].includes(location.pathname);

    return (
        <div className='font-Montserrat'>
            <Header />
            <main className='min-h-screen'>
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default UserLayout;