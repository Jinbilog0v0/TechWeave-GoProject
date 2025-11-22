import { useNavigate, Link } from "react-router-dom";
import React from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import GoogleAuth from "./GoogleAuth";

function Form({ route, method }) {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const isLogin = method === "login";
    const title = isLogin ? "Welcome Back" : "Create Account";
    const subtitle = isLogin ? "Login to continue" : "Join GoProject today";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = isLogin
                ? { username, password }
                : { username, email, password }; // backend doesn’t use email right now

            const res = await api.post(route, payload);

            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/home");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96">

                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                            src="/Images/TemporaryLogo-removebg.png"
                            alt="GoProject Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Title + Subtitle */}
                <h1 className="text-2xl font-bold text-center text-gray-800">{title}</h1>
                <p className="text-sm text-gray-600 text-center mb-6">{subtitle}</p>

                <div className="space-y-4">

                    {/* Username */}
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

                    {/* Only show email when registering */}
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

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder={isLogin ? "Enter password" : "Create a password"}
                            required
                        />
                    </div>

                    {/* Confirm Password (register only) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    {/* Submit Button */}
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

                    {/* Bottom links */}
                    <div className="text-center mt-4 space-y-2">
                        {isLogin ? (
                            <>
                                <Link to="/forgot-password" className="block text-sm text-green-700 hover:underline">
                                    Forgot Password?
                                </Link>
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
