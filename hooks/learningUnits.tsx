import { useState } from "react";
import { useAudioFiles } from "./useAudioFiles";
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

type ButtonConfiguration {
    [button: Button]: LearningUnit;
}

const useModifiableLearningUnits = () => {
  const [units, setUnits] = useAsyncState<LearningUnit[]>("@superstore/learningUnits",
    []);
  const [_, setConfiguration] = useAsyncState<ButtonConfiguration>("@superstore/buttonConfiguration",
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

  const updateConfiguration = (button: Button, configuration: LearningUnit) => {
    setConfiguration({ ...configuration, [button]: configuration });
  }

  return { units, addLearningUnit, removeLearningUnit, updateLearningUnit, setConfiguration };
};

export default useModifiableLearningUnits;