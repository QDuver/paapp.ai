import React from "react";
import { Platform } from "react-native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MainApp from "./components/core/MainApp";
import { AppProvider } from "./contexts/AppContext";
import PreApp from "./components/core/PreApp";
import { theme } from "./styles/theme";

// Load icon fonts CSS for web
if (Platform.OS === "web") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/fonts.css";
  document.head.appendChild(link);
}

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: theme.colors.accent,
    background: theme.colors.primary,
    surface: theme.colors.secondary,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={paperTheme}>
        <AppProvider>
          <PreApp>
            <MainApp />
          </PreApp>
        </AppProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
