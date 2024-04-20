import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { config } from "@tamagui/config/v3";
import { Button, createTamagui, TamaguiProvider } from "tamagui";

// Components
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ButtonGrid from "./components/ButtonGrid";
import Recorder from "./components/Recorder";

// Hooks
import { useAudioFiles } from "./hooks/useAudioFiles";

// Assets
import banana from "@assets/banana-phone.mp3";
import favicon from "@assets/favicon.png";
import { useAsyncState } from "./hooks/useAsyncStorage";
import { useEffect, useState } from "react";
import ParentView from "./pages/ParentView";
import useModifiableLearningUnits from "./hooks/useLearningUnits";

const useButton1 = () => {
  const [value, setValue] = useAsyncState("button", "oneoneone");

  return [value, setValue] as const;
};

const useButton2 = () => {
  const [value, setValue] = useAsyncState("button", "twotwotwo");

  return [value, setValue] as const;
};

export default function App() {
  const {units} = useModifiableLearningUnits();

  const [showParentView, setShowParentView] = useState(false);

  const buttons = units.map((unit) => ({
    label: unit.name,
    onPress: () => {
      const uri = `${FileSystem.documentDirectory}recordings/${unit.audioFile}.caf`;

      FileSystem.getContentUriAsync(uri).then(async (cUri) => {
        const { sound } = await Audio.Sound.createAsync({
          uri: cUri,
        });

        sound.playAsync();
      });
    },
    image: favicon,
  }));

  return (
    <TamaguiProvider config={themeConfig}>
      <View style={styles.container}>
        {showParentView ? (
          <ParentView />
        ) : (
          <ButtonGrid
            buttons={buttons}
          />
        )}
        <Button
          onPress={() => {
            console.log("Pressed change view button");
            setShowParentView((b) => !b);
          }}
        >
          {showParentView ? "Go back to baby view" : "Go to parent view"}
        </Button>
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
