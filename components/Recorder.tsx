import { Button, View, Text } from "tamagui";
import useRecorder from "../hooks/useAudioFiles";
import { useState } from "react";

type RecordProps = {
  fileName: string
  saveLearningUnit: () => void
}

const Recorder = ({ fileName, saveLearningUnit }: RecordProps) => {
  const { startRecording, stopRecording, recording, isRecording } = useRecorder({
    fileToSave: fileName,
  });

  if (!fileName) {
    return <View>
      <Text>Please enter a valid audio name</Text>
    </View>
  }

  return (
    <View>
      {isRecording ?
        <Button onPress={stopRecording}>Stop Recording</Button> :
        <Button onPress={startRecording}>Start Recording</Button>
      }
      {!!recording && !isRecording &&
        <Button onPress={saveLearningUnit}>Save Learning Unit</Button>
      }
    </View>
  );
};

export default Recorder;
