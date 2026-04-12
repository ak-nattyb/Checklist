import { useFonts } from "expo-font";
import { setVisibilityAsync } from "expo-navigation-bar";
import { Stack } from "expo-router";
import { hideAsync } from "expo-splash-screen";
import { setStatusBarHidden } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  InvertColorsProvider,
  useInvertColors,
} from "@/contexts/InvertColorsContext";

function RootNavigation() {
  const { invertColors } = useInvertColors();

  useEffect(() => {
    setVisibilityAsync("hidden").catch(() => {
      // Navigation bar may be unavailable in development environments.
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        animation: "none",
        contentStyle: {
          backgroundColor: invertColors ? "white" : "black",
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="add-item" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-to-list" />
      <Stack.Screen name="create-list" />
      <Stack.Screen name="delete-list" />
      <Stack.Screen name="edit-title" />
      <Stack.Screen name="list/[id]" />
      <Stack.Screen name="list-actions" />
      <Stack.Screen name="manage-items" />
      <Stack.Screen name="delete-items" />
      <Stack.Screen name="reorder-lists" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "PublicSans-Regular": require("../assets/fonts/PublicSans-Regular.ttf"),
  });

  useEffect(() => {
    setStatusBarHidden(true, "none");
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!(fontsLoaded || fontError)) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <InvertColorsProvider>
        <RootNavigation />
      </InvertColorsProvider>
    </GestureHandlerRootView>
  );
}
