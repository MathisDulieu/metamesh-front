import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../hooks/Hooks"; // Implémentez cette fonction pour appeler votre backend
import "../../assets/css/register.css";

function Register() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            await register({ username, email, password }); // Remplacez par l'appel API approprié
            setSuccessMessage("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 3000); // Redirige vers login après 3 secondes
        } catch (error) {
            setErrorMessage("Failed to register. Please try again.");
        }
    };

    const handleMicrosoftRegister = () => {
        alert("Microsoft registration clicked!");
        // Implémentez ici l'intégration Microsoft si nécessaire
    };

    return (
        <div className="container">
            <div className="animation-left"></div>
            <div className="animation-right"></div>

            <form className="form" onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                <h2 style={{ textAlign: "center", marginBottom: "1rem", fontSize: "2.7rem" }}>Register</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="input"
                    required
                />
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
                    Register
                </button>
                <button
                    onClick={handleMicrosoftRegister}
                    type="button"
                    className="button ms-button"
                >
                    Register with Microsoft
                </button>
                <button
                    onClick={() => navigate("/login")}
                    type="button"
                    className="button nav-button"
                >
                    Back to Login
                </button>
            </form>
        </div>
    );
}

export default Register;
