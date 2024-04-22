import { Button, Input, ScrollView, Text, XStack, YStack } from "tamagui";
import useModifiableLearningUnits, {
  LearningUnit,
} from "../hooks/useLearningUnits";
import { useState } from "react";
import Recorder from "../components/Recorder";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import PositionSelector from "../components/PositionSelector";
import ButtonGridWithUnits from "../components/ButtonGrid";
import { tokens } from "@tamagui/config/v3";
import { XCircle } from "@tamagui/lucide-icons";

const beautifulRow = {
  padding: 12,
  backgroundColor: tokens.color.gray3Light.val,
  borderRadius: 12,
  margin: 6,
};

type UnitListItemProps = {
  u: LearningUnit;
  removeLearningUnit: (u: LearningUnit) => void;
  updateConfiguration: ReturnType<
    typeof useModifiableLearningUnits
  >["updateConfiguration"];
  configuration: ReturnType<typeof useModifiableLearningUnits>["configuration"];
};

const UnitListItem = ({
  u,
  removeLearningUnit,
  updateConfiguration,
  configuration,
}: UnitListItemProps) => {
  return (
    <XStack style={beautifulRow}>
      <PositionSelector
        unit={u}
        updateConfiguration={updateConfiguration}
        configuration={configuration}
      />
      <Button
        style={{ flex: 1, backgroundColor: "transparent" }}
        onPress={() => {
          const uri = `${FileSystem.documentDirectory}recordings/${u.audioFile}.caf`;

          FileSystem.getContentUriAsync(uri).then(async (cUri) => {
            const { sound } = await Audio.Sound.createAsync({
              uri: cUri,
            });

            sound.playAsync();
          });
        }}
      >
        <Text style={{ textAlign: "center" }}>{u.name}</Text>
        <Text style={{ textAlign: "center" }}>{u.emoji}</Text>
      </Button>
      <Button
        backgroundColor="transparent"
        onPress={() => {
          removeLearningUnit(u);
        }}
        color={tokens.color.red8Light.val}
        icon={XCircle}
        scaleIcon={1.5}
      />
    </XStack>
  );
};

export default function ParentView({ exit }: { exit: () => void }) {
  // should be using context for this
  const {
    units,
    addLearningUnit,
    removeLearningUnit,
    configuration,
    updateConfiguration,
  } = useModifiableLearningUnits();
  const [audioName, setAudioName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [search, setSearch] = useState("");

  // Will create a filename for the audio.
  const createFileName = (input: string) => {
    const lowerCaseStr = input.toLowerCase();
    const hyphenatedStr = lowerCaseStr.replace(/[^a-z0-9]+/g, "-");
    const trimmedStr = hyphenatedStr.replace(/(^-+|-+$)/g, "");
    return trimmedStr;
  };

  const audioNameAlreadyExists = units.some(
    (u) => u.audioFile === createFileName(audioName)
  );

  return (
    <XStack>
      {
        // First YStack is the list of stuff
      }
      <YStack style={{ padding: 64, width: "40%" }}>
        <Button onPress={exit}>
          <Text>To Baby View</Text>
        </Button>
        <Text style={{ fontSize: 40, alignSelf: "center" }}>Add Words</Text>
        <Text style={{ textAlign: "center" }}>Audio Name:</Text>
        <Input value={audioName} onChangeText={(t) => setAudioName(t)} />
        {audioName && audioNameAlreadyExists && (
          <Text style={{ color: "red", textAlign: "center" }}>
            An audio file already exists with that name.
          </Text>
        )}
        <Text style={{ textAlign: "center" }}>Emoji:</Text>
        <Input value={emoji} onChangeText={(t) => setEmoji(t)} />
        <Recorder
          fileName={audioName}
          saveLearningUnit={() => {
            addLearningUnit({
              audioFile: audioName,
              name: audioName,
              emoji: emoji,
            });
            setAudioName("");
            setEmoji("");
          }}
        />
        <Text style={{ paddingTop: 40, fontSize: 30 }}>Words</Text>
        <Input
          placeholder="What are you looking for?"
          onChangeText={(t) => setSearch(t)}
        />
        <ScrollView maxHeight="40%">
          {/** Search input */}
          {units
            .filter((u) => u.name.includes(search))
            .map((u) => (
              <UnitListItem
                u={u}
                removeLearningUnit={removeLearningUnit}
                updateConfiguration={updateConfiguration}
                configuration={configuration}
              />
            ))}
        </ScrollView>
      </YStack>
      {
        // Second YStack is the grid of buttons
      }
      <YStack style={{ padding: 12, maxWidth: "50%" }}>
        <Text style={{ fontSize: 40, alignSelf: "center" }}>Button Grid</Text>
        <ButtonGridWithUnits key={JSON.stringify(configuration)} />
      </YStack>
    </XStack>
  );
}
