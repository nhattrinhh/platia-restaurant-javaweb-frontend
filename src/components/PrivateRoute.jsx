import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../router';

const PrivateRoute = ({ component: Component, layout: Layout }) => {
    const isAdmin = isAuthenticated();

    if (!isAdmin) {
        // Chuyển hướng về trang chủ hoặc trang đăng nhập nếu không phải ADMIN
        return <Navigate to="/login" replace />;
    }

    return Layout ? <Layout><Component /></Layout> : <Component />;
};

export default PrivateRoute;