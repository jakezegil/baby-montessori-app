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

const useButton1 = () => {
  const [value, setValue] = useAsyncState("button", "oneoneone");

  return [value, setValue] as const;
};

const useButton2 = () => {
  const [value, setValue] = useAsyncState("button", "twotwotwo");

  return [value, setValue] as const;
};

export default function App() {
  const audios = useAudioFiles();

  const [button1, setButton1] = useButton1();
  const [button2, setButton2] = useButton2();
  const [showParentView, setShowParentView] = useState(false)
  console.log("non 1: ", button1);
  console.log("non 2: ", button2);


  useEffect(() => {
    console.log("Button 1: ", button1);
    console.log("Button 2: ", button2);
    setButton1("oneoneone");
    console.log("Button 1: ", button1);
    console.log("Button 2: ", button2);
    setButton2("twotwotwo");
    console.log("Button 1: ", button1);
    console.log("Button 2: ", button2);
  }, []);

  return (
    <TamaguiProvider config={themeConfig}>
      <View style={styles.container}>
        {showParentView ?
          <ParentView /> :
          <ButtonGrid
            buttons={[
              {
                label: "Button 1",
                onPress: async () => {
                  const { sound } = await Audio.Sound.createAsync(banana);

                  sound.playAsync();
                },
                image: favicon,
              },
              {
                label: "Button 2",
                onPress: async () => {
                  const uri = audios.audioFiles.find((audio) =>
                    audio.includes("tile-1")
                  )!;

                  FileSystem.getContentUriAsync(uri).then(async (cUri) => {
                    const { sound } = await Audio.Sound.createAsync({
                      uri: cUri,
                    });

                    sound.playAsync();
                  });
                },
                image: favicon,
              },
              {
                label: "Button 3",
                onPress: () => console.log("Button 3 pressed"),
                image: favicon,
              },
              {
                label: "Button 4",
                onPress: () => console.log("Button 4 pressed"),
                image: favicon,
              },
            ]}
          />

        }
        <Button onPress={() => {
          console.log('Pressed change view button')
          setShowParentView((b) => !b)
        }}>{showParentView ? "Go back to baby view" : "Go to parent view"}</Button>
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
    flexDirection: "column"
  },
});

const themeConfig = createTamagui(config);
