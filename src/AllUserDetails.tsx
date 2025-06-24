// src/components/UserDetailsById.tsx
import React, { useState } from "react";
import axios from "axios";

interface UserDetail {
  _id: string;
  name: string;
  type: "provider" | "consumer";
  username_email: string;
}

const UserDetailsById: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://dips.soton.ac.uk/negotiation-api";

  const handleFetch = async () => {
    setError("");
    setUser(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found. Please log in.");

      console.log("Using token:", token);
      console.log("Fetching details for:", userId);

      const res = await axios.get(
        `${API_URL}/user/details/?user_id=${encodeURIComponent(userId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      const message =
        err.response?.data?.detail || err.message || "Unknown error";
      setError("Fetch failed: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Fetch User Details by ID or Email</h4>

      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter user ID or email"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handleFetch}
          disabled={loading || !userId}
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {user && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">
              <strong>Email:</strong> {user.username_email}
              <br />
              <strong>Role:</strong> {user.type}
              <br />
              <strong>ID:</strong> {user._id}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsById;
