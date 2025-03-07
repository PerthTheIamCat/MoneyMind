import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ServerContext } from "./ServerConText";
import { UserContext } from "./UserContext";

type AuthContextType = {
  token: string | null;
  authLoading: boolean;
  isPinSet: boolean;
  pin: string | null;
  setPin: (pin: string | null) => void;
  setToken: (token: string) => Promise<void>;
  setPinCodeLocal: (pin: string) => Promise<void>;
  setIsPinSet: (value: boolean) => void;
  verifyPin: (userID: number, enteredPin: string) => Promise<boolean>;
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
  const [pin, setPin] = useState<string | null>("");
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPinSet, setIsPinSet] = useState<boolean>(false);
  const [canUseBiometrics, setCanUseBiometrics] = useState<boolean>(false);
  const { URL } = useContext(ServerContext);

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

  const setPinCodeLocal = async (newPin: string) => {
    try {
      await SecureStore.setItemAsync("userPin", newPin);
      setIsPinSet(true);
    } catch (error) {
      console.error("Error setting PIN:", error);
    }
  };

  const verifyPin = async (
    userID: number,
    enteredPin: string
  ): Promise<boolean> => {
    try {
      console.log("Verifying PIN:", enteredPin, "for user ID:", userID);
      const response = await axios.get(`${URL}/auth/getpin/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        const storedPin = response.data.pin;
        console.log("Stored PIN:", response.data.pin);
        return enteredPin === storedPin;
      }
      return false;
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
    checkAuthenticateWithBiometrics().then((result) => {
      setCanUseBiometrics(result);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        pin,
        setPin,
        token,
        authLoading,
        isPinSet,
        canUseBiometrics,
        setPinCodeLocal,
        verifyPin,
        setIsPinSet,
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
