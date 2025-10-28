import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

interface User {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface DecodedToken {
  user_id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  exp: number;
  iat: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const decodeToken = (token: string): User | null => {
    try {
      const decoded = jwt_decode.jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return null; // expired
      }
      return {
        id: decoded.user_id,
        username: decoded.username,
        is_staff: decoded.is_staff,
        is_superuser: decoded.is_superuser,
      };
    } catch {
      return null;
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    const res = await axios.post("http://localhost:8005/api/token/", {
      username,
      password,
    });
    const { access, refresh } = res.data as { access: string; refresh: string };

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    const decodedUser = decodeToken(access);
    setUser(decodedUser);
  };

  const refreshAccessToken = async (): Promise<User | null> => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;
    try {
      const res = await axios.post("http://localhost:8005/api/token/refresh/", {
        refresh,
      });
      const { access } = res.data as { access: string };
      localStorage.setItem("access_token", access);
      return decodeToken(access);
    } catch (err) {
      console.error("Failed to refresh token", err);
      logout();
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const access = localStorage.getItem("access_token");
      if (access) {
        const decodedUser = decodeToken(access);
        if (decodedUser) {
          setUser(decodedUser);
          return;
        }
      }
      // try refreshing if access is missing/invalid
      const refreshedUser = await refreshAccessToken();
      if (refreshedUser) {
        setUser(refreshedUser);
      } else {
        logout();
      }
    };

    bootstrapAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
