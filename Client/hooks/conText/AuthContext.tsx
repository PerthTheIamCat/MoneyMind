import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  token: string | null;
  authLoading: boolean;
  setToken: (token: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // เพิ่ม state สำหรับเช็คสถานะโหลด

  const saveToken = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync("userToken", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const loadToken = async () => {
    setAuthLoading(true);
    try {
      const storedToken = await SecureStore.getItemAsync("userToken");
      if (storedToken) {
        const decoded: any = jwtDecode(storedToken);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
          console.log("Token expired, deleting it");
          await SecureStore.deleteItemAsync("userToken");
          setToken(null);
        } else {
          setToken(storedToken);
        }
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.error("Error loading token:", error);
      setToken(null);
    }
    setAuthLoading(false);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setToken(null);
  };

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, authLoading, setToken: saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};