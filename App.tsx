import { config } from "@tamagui/config/v3";
import { Button, createTamagui, TamaguiProvider } from "tamagui";

// Components
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ButtonGridWithUnits from "./components/ButtonGrid";

// Assets
import {  useState } from "react";
import ParentView from "./pages/ParentView";

const warning = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes("Inter")) return;
  warning(...args);
};

export default function App() {
  const [showParentView, setShowParentView] = useState(false);
  
  const exit = () => setShowParentView((b) => !b);
  return (
    <TamaguiProvider config={themeConfig}>
      <View style={styles.container}>
        {showParentView ? <ParentView exit={exit}  /> : <ButtonGridWithUnits exit={exit} />}
        <StatusBar style="auto" />
      </View>
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
});

const themeConfig = createTamagui(config);
