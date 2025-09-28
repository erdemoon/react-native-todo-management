import FontAwesome from '@react-native-vector-icons/fontawesome';
import * as ExpoImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { View, Switch, Text, Pressable, Image } from 'react-native';

export const ImagePicker = ({
  onSelect,
  initValue,
}: {
  onSelect: (value: string | undefined) => void;
  initValue?: string;
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(!!initValue);
  const [image, setImage] = useState<string | undefined>(initValue ? initValue : undefined);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    onSelect(isEnabled ? image : undefined);
  }, [image, isEnabled]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className="mx-2 mt-5 h-20 flex-row items-center overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 text-[20px] color-white">
      <View className="w-6 flex-row items-center justify-center">
        <FontAwesome name="image" size={20} color="#a6a6a6" />
      </View>
      <Text className="ml-5 text-[20px] color-white">Image</Text>
      {isEnabled ? (
        <Pressable onPress={pickImage} className="mx-4 items-center rounded-full bg-[#3e3e41]">
          {image ? (
            <Image
              className="h-12 w-12 rounded-md"
              source={{
                uri: image,
              }}
            />
          ) : (
            <Text className="px-5 py-1 text-[20px] color-white">Pick</Text>
          )}
        </Pressable>
      ) : (
        <></>
      )}
      <Switch className="my-auto ml-auto" onValueChange={toggleSwitch} value={isEnabled} />
    </View>
  );
};
