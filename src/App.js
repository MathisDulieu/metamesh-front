import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cookies from 'js-cookie';

import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import Home from './pages/Home';
import Subscriptions from './pages/Subscriptions';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Error from './pages/Error';
import { AuthContext } from './services/AuthContext';
import PrivateRoute from './services/PrivateRoute';
import PublicRoute from "./services/PublicRoute";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = Cookies.get('authToken');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute isAuthenticated={isAuthenticated} element={<Login />} />} />
                    <Route path="/register" element={<PublicRoute isAuthenticated={isAuthenticated} element={<Register />} />} />

                    <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Home />} />} />
                    <Route path="/subscriptions" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Subscriptions />} />} />
                    <Route path="/notifications" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Notifications />} />} />
                    <Route path="/settings" element={<PrivateRoute isAuthenticated={isAuthenticated} element={<Settings />} />} />

                    <Route exact path="*" element={<div className="Main"><Error /></div>}/>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}
