import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  token: string | null;
  authLoading: boolean;
  isPinSet: boolean;
  setToken: (token: string) => Promise<void>;
  setPinCode: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  checkAuthenticateWithBiometrics: () => Promise<boolean>;
  useAuthenticationWithBiometrics: () => Promise<boolean>;
  decodeToken: (token: string) => any;
  canUseBiometrics: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPinSet, setIsPinSet] = useState<boolean>(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState<boolean>(false);

  const saveToken = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync("userToken", newToken);
      setToken(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const decodeToken = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      // console.log("Decoded token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

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

  const loadPin = async () => {
    try {
      const storedPin = await SecureStore.getItemAsync("userPin");
      if (storedPin) {
        setIsPinSet(true);
      }
    } catch (error) {
      console.error("Error loading PIN:", error);
    }
  };

  const setPinCode = async (newPin: string) => {
    try {
      await SecureStore.setItemAsync("userPin", newPin);
      setIsPinSet(true);
    } catch (error) {
      console.error("Error setting PIN:", error);
    }
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      const storedPin = await SecureStore.getItemAsync("userPin");
      if (storedPin === enteredPin) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error verifying PIN:", error);
      return false;
    }
  };

  const checkAuthenticateWithBiometrics = async (): Promise<boolean> => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return false;
    } else {
      const biometricRecords = await LocalAuthentication.isEnrolledAsync();
      if (!biometricRecords) {
        return false;
      } else {
        return true;
      }
    }
  };

  const useAuthenticationWithBiometrics = async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    loadToken();
    loadPin();
    checkAuthenticateWithBiometrics().then((result) => {
      setCanUseBiometrics(result);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        authLoading,
        isPinSet,
        canUseBiometrics,
        setPinCode,
        verifyPin,
        setToken: saveToken,
        logout,
        checkAuthenticateWithBiometrics,
        useAuthenticationWithBiometrics,
        decodeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
