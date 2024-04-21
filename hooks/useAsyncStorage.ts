import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const arrayIsEqual = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
}

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
      const parsedValue = value && JSON.parse(value);
      if (parsedValue && !arrayIsEqual(parsedValue, storedValue)) {
        setStoredValue(parsedValue);
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
  }, [storedValue]);


  return [storedValue, setItem, removeItem] as const;
};
