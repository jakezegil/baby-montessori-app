import { useState } from "react";
import { useAudioFiles } from "./sound";

export const buttons = ["Button 1", "Button 2", "Button 3", "Button 4"];

type LearningUnit = {
  name: string;
  audioFile: string;
  // image: string;
};

const useModifiableLearningUnits = () => {
  const { audioFiles } = useAudioFiles();
  const [units, setUnits] = useState<LearningUnit[]>([]);

  const addLearningUnit = (unit: LearningUnit) => {
    setUnits([...units, unit]);
  };

  const removeLearningUnit = (unit: LearningUnit) => {
    setUnits(units.filter((u) => u.name !== unit.name));
  };

  const updateLearningUnit = (unit: LearningUnit) => {
    setUnits(units.map((u) => (u.name === unit.name ? unit : u)));
  };

  return { units, addLearningUnit, removeLearningUnit, updateLearningUnit };
};

export default useModifiableLearningUnits;