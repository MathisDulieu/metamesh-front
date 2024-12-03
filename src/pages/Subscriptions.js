import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/subscriptions.css";
import { AuthContext } from "../services/AuthContext";
import Cookies from "js-cookie";
import { unsubscribe, getUserData } from "../hooks/Hooks"; // Assurez-vous d'avoir une méthode pour récupérer les données utilisateur

function Subscriptions() {
    document.title = "Subscriptions - MetaMesh";

    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);

    // États pour les données et le statut de chargement
    const [subscriptions, setSubscriptions] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const handleLogout = () => {
        Cookies.remove("authToken");
        Cookies.remove("userData");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        navigate("/login");
    };

    const handleUnsubscribe = async (id) => {
        try {
            await unsubscribe(id);
            setSubscriptions((prevSubscriptions) =>
                prevSubscriptions.filter((sub) => sub.id !== id)
            );
        } catch (error) {
            console.error("Failed to unsubscribe:", error);
            alert("An error occurred while unsubscribing. Please try again.");
        }
    };

    const getInitial = (name) => {
        if (!name) return "?";
        return name.charAt(0).toUpperCase();
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const userData = await getUserData(); // Appeler une méthode pour obtenir les données utilisateur

                const fetchedSubscriptions = Object.entries(userData.subscriptions || {}).map(
                    ([id, username]) => ({ id, username })
                );

                const fetchedSubscribers = Object.entries(userData.subscribers || {}).map(
                    ([id, username]) => ({ id, username })
                );

                setSubscriptions(fetchedSubscriptions);
                setSubscribers(fetchedSubscribers);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false); // Désactiver le loader après le chargement
            }
        };

        fetchData();
    }, []); // Charge les données au montage du composant

    return (
        <div className="subscriptions-page">
            <header className="subscriptions-header">
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
            <main className="subscriptions-content">
                {isLoading ? (
                    <div className="loader">Loading data...</div> // Affiche un loader pendant le chargement
                ) : (
                    <>
                        <div className="subscribers-section">
                            <h2>Your Subscribers</h2>
                            <ul>
                                {subscribers.length > 0 ? (
                                    subscribers.map(({ id, username }) => (
                                        <li key={id}>
                                            <div className="list-icon">{getInitial(username)}</div>
                                            <span className="list-text">{username}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No subscribers yet.</p>
                                )}
                            </ul>
                        </div>
                        <div className="subscriptions-section">
                            <h2>Your Subscriptions</h2>
                            <ul>
                                {subscriptions.length > 0 ? (
                                    subscriptions.map(({ id, username }) => (
                                        <li key={id} className="subscription-item">
                                            <div className="list-icon">{getInitial(username)}</div>
                                            <span className="list-text">{username}</span>
                                            <button
                                                className="unsubscribe-button"
                                                onClick={() => handleUnsubscribe(id)}
                                            >
                                                Unsubscribe
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p>No subscriptions yet.</p>
                                )}
                            </ul>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Subscriptions;
