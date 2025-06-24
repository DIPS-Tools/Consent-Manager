// src/api/auth.ts
import axios from "axios";

const API_URL = "https://dips.soton.ac.uk/negotiation-api";

export const registerUser = async ({
  name,
  type,
  username_email,
  password,
  masterPassword,
}: {
  name: string;
  type: "provider" | "consumer";
  username_email: string;
  password: string;
  masterPassword: string;
}) => {
  try {
    const res = await axios.post(
      `${API_URL}/user/register?master_password_input=${encodeURIComponent(
        masterPassword
      )}`,
      {
        name,
        type,
        username_email,
        password,
      }
    );
    return res.data;
  } catch (error: any) {
    console.error("Register error:", error.response?.data || error.message);
    if (error.response?.data?.detail?.[0]?.msg) {
      throw new Error(error.response.data.detail[0].msg);
    }
    if (error.response?.data?.detail) {
      throw new Error(JSON.stringify(error.response.data.detail));
    }
    throw new Error("Registration failed");
  }
};

export const loginUser = async ({
  username_email,
  password,
}: {
  username_email: string;
  password: string;
}) => {
  const params = new URLSearchParams();
  params.append("username", username_email);
  params.append("password", password);
  // Optionally:
  // params.append("grant_type", "");
  // params.append("scope", "");

  const res = await axios.post(`${API_URL}/user/login/`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.data; // This should return the access token
};
