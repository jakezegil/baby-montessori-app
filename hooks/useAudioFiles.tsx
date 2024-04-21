import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { useAsyncState } from "./useAsyncStorage";

/** Record saved audio files */
const useRecorder = ({ fileToSave }: { fileToSave: string }) => {
  const [permissioned, setPermissioned] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Simply get recording permission upon first render
  useEffect(() => {
    async function getPermission() {
      if (permissioned) {
        return;
      }

      // check if permissions are granted
      Audio.getPermissionsAsync().then((permission) => {
        permission.granted ? setPermissioned(true) : setPermissioned(false);
      });

      if (!permissioned) {
        await Audio.requestPermissionsAsync()
          .then((permission) => {
            setPermissioned(permission.granted);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    // Call function to get permission
    getPermission();
  }, [permissioned]);

  async function startRecording() {
    try {
      // needed for IoS

      if (!isRecording) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await recording.startAsync();

        setRecording(recording);
        setIsRecording(true);
      }
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  async function stopRecording() {
    try {
      if (isRecording && recording) {
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI()!;

        // Create a file name for the recording
        const fileName = `${fileToSave}.caf`;

        const directoryExists = await FileSystem.getInfoAsync(
          FileSystem.documentDirectory + "recordings/"
        ).then(async (res) => {
          if (res.exists === false) {
            // Create if not exists
            await FileSystem.makeDirectoryAsync(
              FileSystem.documentDirectory + "recordings/",
              { intermediates: true }
            );
          }
        });

        // Move the recording to the new directory with the new file name
        await FileSystem.moveAsync({
          from: recordingUri,
          to: FileSystem.documentDirectory + "recordings/" + `${fileName}`,
        });

        // This is for simply playing the sound back
        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({
          uri: FileSystem.documentDirectory + "recordings/" + `${fileName}`,
        });
        await playbackObject.playAsync();

        // setRecording(null);
        setIsRecording(false);
      }
    } catch (error) {
      setIsRecording(false);
      console.error("Failed to stop recording", error);
    }
  }

  return { startRecording, stopRecording, recording, isRecording };
};

export default useRecorder;

/** Use saved audio files */
export const useAudioFiles = () => {
  const [audioFiles, setAudioFiles] = useAsyncState<string[]>(
    "@superstore/audioFiles",
    []
  );

  useEffect(() => {
    async function getAudioFiles() {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + "recordings/"
      );
      setAudioFiles(
        files.map((file) => FileSystem.documentDirectory + "recordings/" + file)
      );
      console.log("FILES: ", files);
    }

    getAudioFiles();
  }, []);

  return { audioFiles };
};
