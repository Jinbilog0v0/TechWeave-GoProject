import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../api";

const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;

      // Send Google token to Django for verification & JWT creation
      const res = await api.post("/api/google-auth/", {
        token: googleToken,
      });

      console.log("Backend login response:", res.data);

      // Save JWT tokens returned by your Django backend
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("given_name", res.data.given_name);
      localStorage.setItem("email", res.data.email);

      navigate("/home");
    } catch (error) {
      console.error("Google Authentication Failed:", error);
      alert("Authentication failed. Try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => alert("Google Login Failed")}
      theme="outline"
      shape="pill"
      size="large"
      text="signin_with"
      width="280"
    />
  );
};

export default GoogleAuth;
