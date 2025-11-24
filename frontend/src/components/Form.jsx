import { useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import GoogleAuth from "./GoogleAuth";
import { Eye, EyeOff } from "lucide-react"; // Add icons

function Form({ route, method }) {
const navigate = useNavigate();
const [username, setUsername] = React.useState("");
const [password, setPassword] = React.useState("");
const [email, setEmail] = React.useState("");
const [confirmPassword, setConfirmPassword] = React.useState("");
const [loading, setLoading] = React.useState(false);
const [showPassword, setShowPassword] = React.useState(false);
const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

const [error, setError] = useState('')

const isLogin = method === "login";
const title = isLogin ? "Welcome Back" : "Create Account";
const subtitle = isLogin ? "Login to continue" : "Join GoProject today";

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const payload = isLogin
            ? { username, password }
            : { username, email, password }; 

        const res = await api.post(route, payload);

        if (isLogin) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/home");
        } else {
            navigate("/login");
        }
    } catch (err) {
        const res = err.response;
        if (res) {
            if (res.status === 401) {
                setError(res.data.detail === "No active account found with the given credentials"
                    ? "Invalid username or password"
                    : res.data.detail);
            } else if (res.status === 400) {
                setError(res.data.username?.[0] || res.data.email?.[0] || "Something went wrong");
            } else setError("Network error. Please try again");
        }

    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    const timer = setTimeout(() => {setError('')}, 2000)

    return () => clearTimeout(timer)
})

return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-96">
            <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                        src="/Images/TemporaryLogo-removebg.png"
                        alt="GoProject Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800">{title}</h1>
            <p className="text-sm text-gray-600 text-center mb-6">{subtitle}</p>

            {error && <p className="text-red-500 text-sm text-center font-medium animate-fade-in my-2">{error}</p>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={isLogin ? "Enter username" : "Choose a username"}
                        required
                    />
                </div>

                {!isLogin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                )}

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                        placeholder={isLogin ? "Enter password" : "Create a password"}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-10"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {!isLogin && (
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                            placeholder="Confirm your password"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-10"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition-colors font-medium"
                >
                    {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
                </button>

                <div className="w-full flex items-center justify-center">
                  <GoogleAuth />
                </div>

                <div className="text-center mt-4 space-y-2">
                    {isLogin ? (
                        <>
                            {/* <Link to="/forgot-password" className="block text-sm text-green-700 hover:underline">
                                Forgot Password?
                            </Link> */}
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-green-700 hover:underline">Sign Up</Link>
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-green-700 hover:underline">Log In</Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    </form>
);
}

export default Form;
