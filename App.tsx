import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { config } from "@tamagui/config/v3";
import { createTamagui, TamaguiProvider } from "tamagui";

// Components
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import ButtonGrid from "./components/ButtonGrid";
import Recorder from "./components/Recorder";

// Hooks
import { useAudioFiles } from "./hooks/sound";

// Assets
import banana from "@assets/banana-phone.mp3";
import favicon from "@assets/favicon.png";

export default function App() {
  const audios = useAudioFiles();

  console.log(audios.audioFiles);
  console.log(audios.audioFiles.find((audio) => audio.includes("tile-1")));

  return (
    <TamaguiProvider config={themeConfig}>
      <View style={styles.container}>
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

                console.log(uri);
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
        <StatusBar style="auto" />
      </View>
      <View>
        <Recorder />
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
  },
});

const themeConfig = createTamagui(config);
