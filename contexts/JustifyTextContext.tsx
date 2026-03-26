import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type JustifyText = "Left" | "Right";

interface JustifyTextContextType {
  justifyText: JustifyText;
  setJustifyText: (value: JustifyText) => void;
}

const JustifyTextContext = createContext<JustifyTextContextType>({
  justifyText: "Left",
  setJustifyText: () => {},
});

export const useJustifyText = () => useContext(JustifyTextContext);

export const JustifyTextProvider = ({ children }: { children: ReactNode }) => {
  const [justifyText, setJustifyTextState] = useState<JustifyText>("Left");

  useEffect(() => {
    AsyncStorage.getItem("justifyText").then((value) => {
      if (value !== null) {
        setJustifyTextState(value as JustifyText);
      }
    });
  }, []);

  const setJustifyText = async (value: JustifyText) => {
    setJustifyTextState(value);
    await AsyncStorage.setItem("justifyText", value.toString());
  };

  return (
    <JustifyTextContext.Provider value={{ justifyText, setJustifyText }}>
      {children}
    </JustifyTextContext.Provider>
  );
};
