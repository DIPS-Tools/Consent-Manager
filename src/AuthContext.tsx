// src/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "./Api/Auth"; // Your API function

// Define the shape of your JWT payload
interface TokenPayload {
  sub: string; // User ID
  username?: string;
  role?: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

interface AuthContextType {
  token: string | null;
  user: TokenPayload | null;
  role: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const decodeToken = (token: string): TokenPayload | null => {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  };

  const login = (token: string) => {
    const decoded = decodeToken(token);
    if (!decoded) throw new Error("Invalid token");

    localStorage.setItem("token", token);
    setToken(token);
    setUser(decoded);
    console.log("Decoded token inside AuthContext:", decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, role: user?.role || null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
