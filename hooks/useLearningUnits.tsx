import { useAsyncState } from "./useAsyncStorage";

export enum Button {
    One,
    Two,
    Three,
    Four
};

type LearningUnit = {
  name: string;
  audioFile: string;
  // image: string;
};

type ButtonConfiguration = Record<string, LearningUnit>;

const useModifiableLearningUnits = () => {
  const [units, setUnits] = useAsyncState<LearningUnit[]>("@superstore/learningUnits",
    []);
  const [configuration, setConfiguration] = useAsyncState<ButtonConfiguration>("@superstore/buttonConfiguration",
    {});

  const addLearningUnit = (unit: LearningUnit) => {
    setUnits([...units, unit]);
  };

  const removeLearningUnit = (unit: LearningUnit) => {
    setUnits(units.filter((u) => u.name !== unit.name));
  };

  const updateLearningUnit = (unit: LearningUnit) => {
    setUnits(units.map((u) => (u.name === unit.name ? unit : u)));
  };

  const updateConfiguration = (button: Button, config: LearningUnit) => {
    setConfiguration({ ...configuration, [button]: config });
  }

  return { units, addLearningUnit, removeLearningUnit, updateLearningUnit, setConfiguration, updateConfiguration };
};


const useLearningUnits = () => {
  const [units] = useAsyncState<LearningUnit[]>("@superstore/learningUnits", []);

  return { units };
}

export default useModifiableLearningUnits;