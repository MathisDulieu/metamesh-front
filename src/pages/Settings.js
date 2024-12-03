import React, { useState, useEffect, useContext } from "react";
import { getUserData, setUserPrivacy } from "../hooks/Hooks";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/settings.css";
import { AuthContext } from "../services/AuthContext";
import Cookies from "js-cookie";

function Settings() {
    document.title = "Settings - MetaMesh";

    const [isPrivate, setIsPrivate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState("");
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
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getUserData();
                setUsername(data.username);
                setEmail(data.email);
                setUserId(data.id);
                setIsPrivate(data.private);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handlePrivacyToggle = async (value) => {
        try {
            await setUserPrivacy(userId, value); // Passez l'userId et la valeur
            setIsPrivate(value);
        } catch (error) {
            console.error("Failed to set account privacy:", error);
            alert("An error occurred while updating account privacy.");
        }
    };

    const getInitial = (name) => {
        if (!name) return "?";
        return name.charAt(0).toUpperCase();
    };

    if (isLoading) {
        return <div className="loader">Loading settings...</div>;
    }

    return (
        <div className="settings-page">
            <header className="settings-header">
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
            <main className="settings-content">
                {userId ? (
                    <div className="profile-section settings-section">
                        <div className="profile-picture">
                            <div className="profile-initial">{getInitial(username)}</div>
                        </div>
                        <div className="profile-info">
                            <h2>{username}</h2>
                            <p>Email: {email}</p>
                        </div>
                    </div>
                ) : (
                    <p>Failed to load user data.</p>
                )}

                <div className="privacy-settings settings-section">
                    <h2>Privacy Settings</h2>
                    <p>
                        A public account allows everyone to see your posts. A private account
                        restricts access to your posts.
                    </p>
                    <div className="privacy-options">
                        <button
                            className={`privacy-button ${!isPrivate ? "active" : ""}`}
                            onClick={() => handlePrivacyToggle(false)}
                        >
                            Public
                        </button>
                        <button
                            className={`privacy-button ${isPrivate ? "active" : ""}`}
                            onClick={() => handlePrivacyToggle(true)}
                        >
                            Private
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Settings;
