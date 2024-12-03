import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../../hooks/Hooks';
import Cookies from 'js-cookie';
import { AuthContext } from "../../services/AuthContext";
import "../../assets/css/login.css";

function Login() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            const token = await login({ email, password });
            Cookies.set('authToken', token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            setErrorMessage('Incorrect credentials');
        }
    };

    return (
        <div className="container">
            {/* Animations */}
            <div className="animation-left"></div>
            <div className="animation-right"></div>

            {/* Formulaire */}
            <form className="form" onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "2.7rem" }}>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input"
                    required
                />
                <button type="submit" className="button">
                    Login
                </button>
                <button
                    onClick={() => alert("Microsoft authentication clicked!")}
                    type="button"
                    className="button ms-button"
                >
                    Login with Microsoft
                </button>
                <button
                    onClick={() => navigate("/register")}
                    type="button"
                    className="button nav-button"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Login;
