import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../Api/Auth";
import { useAuth } from "../../AuthContext"; // Your own context that accepts a token
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "../../css/Login.module.css";

const OwnerRegister: React.FC = () => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Register user via custom API
      await registerUser({
        name,
        type: "owner",
        username_email: email,
        password,
        masterPassword: "5hnd..jk4ne!kwjs?wnsmmf", // or ask the user for it if needed
      });

      // Log in to get token
      const { access_token } = await loginUser({
        username_email: email,
        password,
      });

      // Save token to localStorage or context
      login(access_token);

      // Redirect
      navigate("/ownerBase/ownerDashboard");
    } catch (err: any) {
      console.error(err);
      setError("Failed to register user.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={`${styles.loginBox} container w-25 p-5 shadow rounded`}>
        <h3>Register as a data owner</h3>
        <p className="mt-3">
          Already have an account? <Link to="/ownerLogin">Login</Link>
        </p>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Same form inputs */}
          <div className="mb-3">
            <label className={`${styles.formLabel} form-label`}>Name</label>
            <input
              type="text"
              value={name}
              className={`${styles.formInput} form-control`}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className={`${styles.formLabel} form-label`}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              className={`${styles.formInput} form-control`}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className={`${styles.formLabel} form-label`}>Password</label>
            <input
              type="password"
              value={password}
              className={`${styles.formInput} form-control`}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className={`${styles.formLabel} form-label`}>
              Re-type password
            </label>
            <input
              type="password"
              value={retypePassword}
              className={`${styles.formInput} form-control`}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" required />
            <label className="form-check-label">
              I agree to the <Link to="/">Terms</Link> and{" "}
              <Link to="/">Privacy</Link>.
            </label>
          </div>
          <div className="mb-3 mt-4">
            <button type="submit" className={`${styles.primaryButton} btn`}>
              Register
            </button>
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

export default OwnerRegister;
