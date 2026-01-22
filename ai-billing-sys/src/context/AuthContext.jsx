import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:8080/api/auth";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // -------------------------
    // LOGIN
    // -------------------------
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password,
            });

            const { token } = res.data;

            // Decode minimal user info (or fetch /me later)
            const loggedInUser = {
                email,
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(loggedInUser));

            setUser(loggedInUser);
            return loggedInUser;
        } catch (err) {
            throw (
                err.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };

    // -------------------------
    // REGISTER
    // -------------------------
    const register = async (name, email, password, role) => {
        try {
            await axios.post(`${API_BASE_URL}/register`, {
                name,
                email,
                password,
                role,
            });

            // Optional: auto-login after register
            return await login(email, password);
        } catch (err) {
            throw (
                err.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    // -------------------------
    // LOGOUT
    // -------------------------
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
