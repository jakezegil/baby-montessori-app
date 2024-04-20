import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useAsyncStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setItem = async (value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  const getItem = async () => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setStoredValue(JSON.parse(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { storedValue, setItem, removeItem, getItem };
};

export const useAsyncState = <T>(key: string, initialValue: T) => {
  const { storedValue, setItem, removeItem, getItem } = useAsyncStorage<T>(
    key,
    initialValue
  );

  useEffect(() => {
    getItem();
  }, []);

  return [storedValue, setItem, removeItem] as const;
};
