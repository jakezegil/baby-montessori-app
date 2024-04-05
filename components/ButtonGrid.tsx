import { tokens } from "@tamagui/config/v3";
import { StyleSheet } from "react-native";
import { Button, Image, Text, XStack, YStack } from "tamagui";
import Sound from "react-native-sound";

interface IButton {
  label: string;
  onPress: () => void;
  image: string;
  audio?: Sound;
}

const Tile = ({ label, onPress, image }: IButton) => {
  return (
    <Button
      alignSelf="center"
      size="$12"
      style={{ width: "45%", height: "90%" }}
      onPress={onPress}
    >
      <YStack gap="$2" justifyContent="center">
        <Text>{label}</Text>
        <Image source={{ uri: image }} style={{}} />
      </YStack>
    </Button>
  );
};

const ButtonGrid = ({ buttons }: { buttons: IButton[] }) => {
  return (
    <YStack gap="$6" padding="$3" minHeight="100%">
      <XStack gap="$6" justifyContent="center" minHeight="45%">
        {buttons.slice(0, 2).map((button) => (
          <Tile {...button} />
        ))}
      </XStack>
      <XStack gap="$6" justifyContent="center" minHeight="45%">
        {buttons.slice(2, 4).map((button, i) => (
          <Tile {...button} />
        ))}
      </XStack>
    </YStack>
  );
};

export default ButtonGrid;

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
