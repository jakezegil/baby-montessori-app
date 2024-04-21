import { useAsyncState } from "./useAsyncStorage";
import { useAudioFiles } from "./useAudioFiles";

export enum ButtonPos {
  One,
  Two,
  Three,
  Four,
}

export type LearningUnit = {
  name: string;
  audioFile: string;
  emoji: string;
  // image: string;
};

type ButtonConfiguration = Record<string, LearningUnit>;

const useModifiableLearningUnits = () => {
  const [units, setUnits] = useAsyncState<LearningUnit[]>(
    "@superstore/learningUnits",
    []
  );
  const [configuration, setConfiguration] = useAsyncState<ButtonConfiguration>(
    "@superstore/buttonConfiguration",
    {}
  );

  const addLearningUnit = (unit: LearningUnit) => {
    setUnits([...units, unit]);
  };

  const removeLearningUnit = (unit: LearningUnit) => {
    const position =
      Object.keys(configuration).find(
        (key) => configuration[key].name === unit.name
      ) || "";
    // remove the position key
    const { [position]: _, ...res } = configuration;
    setUnits(units.filter((u) => u.name !== unit.name));
    setConfiguration(res);
  };

  const updateLearningUnit = (unit: LearningUnit) => {
    setUnits(units.map((u) => (u.name === unit.name ? unit : u)));
  };

  const updateConfiguration = (button: ButtonPos, config: LearningUnit) => {
    setConfiguration({ ...configuration, [button]: config });
  };

  return {
    units,
    configuration,
    addLearningUnit,
    removeLearningUnit,
    updateLearningUnit,
    setConfiguration,
    updateConfiguration,
  };
};

export default useModifiableLearningUnits;
