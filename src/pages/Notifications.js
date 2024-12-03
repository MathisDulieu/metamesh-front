import React, { useContext, useEffect, useState } from "react";
import { getNotifications } from "../hooks/Hooks";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/notifications.css";
import Cookies from "js-cookie";
import { AuthContext } from "../services/AuthContext";

function Notifications() {
    document.title = "Notifications - MetaMesh";

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Ajout de l'état de chargement
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = () => {
        Cookies.remove("authToken");
        Cookies.remove("userData");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        navigate("/login");
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("User ID not found in localStorage. Redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const fetchedNotifications = await getNotifications(userId);
                const notificationsWithFormattedDates = fetchedNotifications.map((notification) => ({
                    ...notification,
                    createdAt: new Date(notification.createdAt).toLocaleString(), // Convertir la date ISO en format lisible
                }));
                setNotifications(notificationsWithFormattedDates);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setIsLoading(false); // Désactiver le loader une fois le chargement terminé
            }
        };

        fetchNotifications();
    }, [navigate]);

    return (
        <div className="notifications-page">
            <header className="notifications-header">
                <nav className="nav-menu">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/subscriptions" className="nav-link">
                        Subscriptions
                    </Link>
                    <Link to="/notifications" className="nav-link">
                        Notifications
                    </Link>
                    <Link to="/settings" className="nav-link">
                        Settings
                    </Link>
                </nav>
                <div className="header-actions">
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>
            <main className="notifications-content">
                {isLoading ? ( // Affiche le loader si les notifications sont en cours de chargement
                    <div className="loader">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index} className="notification-item">
                                <span className="notification-date">{notification.createdAt}</span>
                                <span className="notification-message">{notification.message}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notifications available.</p>
                )}
            </main>
        </div>
    );
}

export default Notifications;
