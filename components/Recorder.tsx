import { Button, View } from "tamagui";
import useRecorder from "../hooks/sound";

const Recorder = () => {
  const { startRecording, stopRecording } = useRecorder({fileToSave: "file-1"});
  return (
    <View>
      <Button onPress={startRecording}>Start Recording</Button>
      <Button onPress={stopRecording}>Stop Recording</Button>
    </View>
  );
};

export default Recorder;