import { View } from "react-native";
import { Button, Image, Input, Text, XStack, YStack } from "tamagui";
import useModifiableLearningUnits from "../hooks/useLearningUnits";
import { useState } from "react";
import Recorder from "../components/Recorder";
// import useModifiableLearningUnits from "../hooks/learningUnits";

export default function ParentView() {
    // const { units } = useModifiableLearningUnits()
    const { units, addLearningUnit } = useModifiableLearningUnits()
    const [audioName, setAudioName] = useState("")

    // Will create a filename for the audio.
    const createFileName = (input: string) => {
        const lowerCaseStr = input.toLowerCase();
        const hyphenatedStr = lowerCaseStr.replace(/[^a-z0-9]+/g, '-');
        const trimmedStr = hyphenatedStr.replace(/(^-+|-+$)/g, '');
        return trimmedStr
    }

    const audioNameAlreadyExists = units.some(u => u.audioFile === createFileName(audioName))

    return <View style={{ padding: 64, }} >
        <Text style={{ fontSize: 40 }}>Add learning units</Text>
        <Text style={{ textAlign: "center" }}>Audio Name:</Text>
        <Input value={audioName} onChangeText={(t) => setAudioName(t)} />
        {audioName && audioNameAlreadyExists &&
            <Text style={{ color: "red", textAlign: "center" }}>An audio file already exists with that name.</Text>
        }
        <Recorder fileName={audioName} saveLearningUnit={() => {
            addLearningUnit({
                audioFile: audioName,
                name: audioName
            })
            setAudioName("")
        }} />
        <Text style={{ paddingTop: 40, fontSize: 30 }}>Learning units</Text>
        {units.map(u => <View>
            <Button>
                <Text style={{ textAlign: "center" }}>{u.name}</Text>
            </Button>
        </View>)}
    </View>
}