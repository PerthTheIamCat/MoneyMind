import { useState, useContext } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { ServerContext } from "@/hooks/conText/ServerConText";

export type Device = {
  id: number;
  device_name: string;
  ip_address: string;
  location: string;
  last_login: string;
};

export const useDeviceHandler = () => {
  const { URL } = useContext(ServerContext);
  const auth = useContext(AuthContext);

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * 📌 Fetch all devices for a user
   */
  const fetchDevices = async (userId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/devices/${userId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      if (response.data.success && response.data.result.length > 0) {
        setDevices(response.data.result); // ✅ Update with new device list
      } else {
        setDevices([]); // ✅ Explicitly clear the devices state
      }
    } catch (error) {
      console.log("Failed to fetch device..", error);
      setDevices([]); // ✅ Clear state on error
    }
    setLoading(false);
  };

  /**
   * 📌 Register a new device
   */
  const registerDevice = async (userId: number) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${URL}/devices/create`,
        { user_id: userId },
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Device registered successfully.");
        fetchDevices(userId);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to register device.");
    }
    setLoading(false);
  };

  /**
   * 📌 Delete a specific device by ID
   */
  const deleteDevice = async (deviceId: number, userId: number) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${URL}/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
        data: { user_id: userId },
      });

      if (response.data.success) {
        Alert.alert("Success", "Device removed.");
        fetchDevices(userId);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to remove device.");
    }
    setLoading(false);
  };

  /**
   * 📌 Sign out from all other devices
   */
  const signOutFromOtherDevices = async (userId: number, deviceId: number) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${URL}/devices/user/${userId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
        data: { device_id: deviceId },
      });

      if (response.data.success) {
        Alert.alert("Success", "Signed out from all other devices.");
        fetchDevices(userId);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sign out from other devices.");
    }
    setLoading(false);
  };

  return {
    devices,
    loading,
    fetchDevices,
    registerDevice,
    deleteDevice,
    signOutFromOtherDevices,
  };
};
