import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ isAuthenticated, element: Component }) => {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
        return <Navigate to="/login" replace />;
    }
    return isAuthenticated ? Component : <Navigate to="/login" replace />;
};

export default PrivateRoute;