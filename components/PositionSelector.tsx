import { useState } from "react";
import { Modal } from "react-native";
import { Button, Text, View } from "tamagui";
import useModifiableLearningUnits, {
  ButtonPos,
  LearningUnit,
} from "../hooks/useLearningUnits";
import { tokens } from "@tamagui/config/v3";

type PositionSelectorProps = {
    unit: LearningUnit;
    configuration:  ReturnType<typeof useModifiableLearningUnits>["configuration"];
    updateConfiguration: ReturnType<typeof useModifiableLearningUnits>["updateConfiguration"];
    };

const PositionSelector = ({ unit, configuration, updateConfiguration }: PositionSelectorProps) => {
  const [expanded, setExpanded] = useState(false);

  // check if unit is already in configuration
  const position = Object.keys(configuration).find(
    (key) => configuration[key].name === unit.name
  );

  const onChange = (position: ButtonPos) => {
    console.log("Position selected: ", position);

    updateConfiguration(position, unit);

    setExpanded(false);
  };

  return (
    <View>
      <Button backgroundColor="transparent" onPress={() => setExpanded((e) => !e)}>
        {!expanded && position ? `${+position + 1}` : "N/A"}
      </Button>
      {expanded && (
        <Modal>
          <Text>Position Selector</Text>
          <Button onPress={() => onChange(ButtonPos.One)}>Top Left</Button>
          <Button onPress={() => onChange(ButtonPos.Two)}>Top Right</Button>
          <Button onPress={() => onChange(ButtonPos.Three)}>Bottom Left</Button>
          <Button onPress={() => onChange(ButtonPos.Four)}>Bottom Right</Button>
          <Button onPress={() => setExpanded(false)} backgroundColor={tokens.color.red8Light.val} >Cancel</Button>
        </Modal>
      )}
    </View>
  );
};

export default PositionSelector;
