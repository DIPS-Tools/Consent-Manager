// src/components/Login/Login.tsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Api/Auth";
import { useAuth } from "../../AuthContext";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "../../css/Login.module.css";
import { jwtDecode } from "jwt-decode";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const role = user.role;
    console.log("Redirecting with role:", role);

    if (role === "provider") {
      navigate("/ownerBase/ownerDashboard", { replace: true });
    } else if (role === "consumer") {
      navigate("/requesterBase/requesterDashboard", { replace: true });
    }
  }, [user?.role, navigate]); // <- DEPEND ON user?.role

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with", email);
      const { access_token } = await loginUser({
        username_email: email,
        password,
      });

      console.log("Received access token:", access_token);
      console.log("Decoded token:", jwtDecode(access_token));

      login(access_token); // Sets context and triggers useEffect
      console.log("Login called, access_token set.");

      // TEMPORARY TEST — does this redirect immediately?
      // navigate("/ownerBase/ownerDashboard", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }

    console.log("Login.tsx: user =", user);
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.loginBox} container w-25 p-5 shadow rounded`}>
        <h3>Login to your account</h3>
        <p className="mt-3">
          Don't have an account? <Link to="/getStarted">Sign up</Link>
        </p>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className={`${styles.formLabel} form-label`}>
              Email address
            </label>
            <input
              type="email"
              className={`${styles.formInput} form-control`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className={`${styles.formLabel} form-label`}>Password</label>
            <input
              type="password"
              className={`${styles.formInput} form-control`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="d-flex mt-4">
            <div className="me-auto">
              <button
                className={`${styles.primaryButton} btn`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
            <div className="align-self-center">
              <Link to="">I forgot my password.</Link>
            </div>
          </div>
        </form>
      </div>
      <br />
      <br />
      <br />
      <Footer />
    </>
  );
};

export default Login;
