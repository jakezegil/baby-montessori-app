import { tokens } from "@tamagui/config/v3";
import { PanResponder, StyleSheet } from "react-native";
import { Button, Image, Text, View, XStack, YStack } from "tamagui";
import Sound from "react-native-sound";
import useModifiableLearningUnits from "../hooks/useLearningUnits";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";

interface IButton {
  label: string;
  onPress: () => void;
  image: string;
  audio?: Sound;
  index: number;
}

const indexToColor = (index: number) => {
  switch (index) {
    case 0:
      return tokens.color.orange8Light.val;
    case 1:
      return tokens.color.green8Light.val;
    case 2:
      return tokens.color.blue8Light.val;
    case 3:
      return tokens.color.yellow8Light.val;
  }
};

const Tile = ({ label, onPress, image, index }: IButton) => {
  return (
    <Button
      alignSelf="center"
      size="$12"
      style={{ width: "45%", height: "90%" }}
      backgroundColor={indexToColor(index)}
      onPress={onPress}
    >
      <YStack gap="$2" justifyContent="center">
        <Text>{label}</Text>
        <Text>{image}</Text>
      </YStack>
    </Button>
  );
};

const ButtonGrid = ({
  buttons,
  exit,
}: {
  buttons: IButton[];
  exit?: () => void;
}) => {
  const [exitCount, setExitCount] = useState(0);

  // This useEffect will reset the exitCount after 3 seconds
  // so if the user wants to exit, they have to press the button 5 times in 3 seconds
  useEffect(() => {
    console.log(exitCount);
    if (exitCount === 1) {
      setTimeout(() => setExitCount(0), 3000);
    }
    if (exitCount === 5) {
      exit?.();
    }
  }, [exitCount]);

  return (
    <YStack gap="$6" padding="$3" minHeight="60%">
      {/* An absolutely positioned hidden button in the top right */}
      {exit && (
        <Button
          position="absolute"
          top="0"
          left="0"
          zIndex={100}
          backgroundColor={tokens.color.orange3Light.val}
          onPress={() => setExitCount((c) => c + 1)}
        />
      )}
      <XStack gap="$6" justifyContent="center" minHeight="45%">
        {buttons.slice(0, 2).map((button, idx) => (
          <Tile key={idx} {...button} index={idx} />
        ))}
      </XStack>
      <XStack gap="$6" justifyContent="center" minHeight="45%">
        {buttons.slice(2, 4).map((button, idx) => (
          <Tile key={idx} {...button} index={idx + 2} />
        ))}
      </XStack>
    </YStack>
  );
};

const ButtonGridWithUnits = ({ exit }: { exit?: () => void }) => {
  const { configuration } = useModifiableLearningUnits();

  const buttons = Object.values(configuration).map((unit, i) => ({
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
    image: unit.emoji,
    index: i,
  }));

  return (
    <View>
      <ButtonGrid buttons={buttons} exit={exit} />
    </View>
  );
};

export default ButtonGridWithUnits;

// Pressable style should change on press
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    flex: 1,
    padding: 64,
  },
  button: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    alignSelf: "stretch",
    flexBasis: "40%",
    shadowOpacity: 0.5,
  },
  text: {
    fontSize: 20,
  },
});

type BIndex = keyof typeof buttonStyles;

const buttonStyles = StyleSheet.create({
  "0": {
    backgroundColor: tokens.color.orange8Light.val,
  },
  "1": {
    backgroundColor: tokens.color.green8Light.val,
  },
  "2": {
    backgroundColor: tokens.color.blue8Light.val,
  },
  "3": {
    backgroundColor: tokens.color.yellow8Light.val,
  },
});
