import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DisplayMode = "Lg" | "Md" | "Sm";

interface DisplayModeContextType {
  displayMode: DisplayMode;
  setDisplayMode: (value: DisplayMode) => void;
}

const DisplayModeContext = createContext<DisplayModeContextType>({
  displayMode: "Md",
  setDisplayMode: () => {},
});

export const useDisplayMode = () => useContext(DisplayModeContext);

export const DisplayModeProvider = ({ children }: { children: ReactNode }) => {
  const [displayMode, setDisplayModeState] = useState<DisplayMode>("Md");

  useEffect(() => {
    AsyncStorage.getItem("displayMode").then((value) => {
      if (value !== null) {
        setDisplayModeState(value as DisplayMode);
      }
    });
  }, []);

  const setDisplayMode = async (value: DisplayMode) => {
    setDisplayModeState(value);
    await AsyncStorage.setItem("displayMode", value.toString());
  };

  return (
    <DisplayModeContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
};
