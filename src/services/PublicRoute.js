import {Navigate} from 'react-router-dom';

const PublicRoute = ({ isAuthenticated, element: Component }) => {
    return isAuthenticated ? <Navigate to="/" replace /> : Component;
}
export default PublicRoute;