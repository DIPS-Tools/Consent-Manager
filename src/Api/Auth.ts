// src/api/auth.ts
import axios from "axios";

const API_URL = "https://dips.soton.ac.uk/negotiation-api";

// src/Api/Auth.ts
export const registerUser = async ({
  name,
  type,
  username_email,
  password,
  masterPassword,
}: {
  name: string;
  type: "owner" | "consumer";
  username_email: string;
  password: string;
  masterPassword: string;
}) => {
  const res = await axios.post(
    `https://dips.soton.ac.uk/negotiation-api/user/register?master_password_input=${encodeURIComponent(
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
};

export const loginUser = async ({
  username_email,
  password,
}: {
  username_email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}/user/login`, {
    username_email,
    password,
  });
  return res.data; // { access_token: string }
};
