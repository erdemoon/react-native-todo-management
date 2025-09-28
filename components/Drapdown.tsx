import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { GlassView } from 'expo-glass-effect';
import { useState, useRef } from 'react';
import { Text, Pressable, FlatList, View, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  initial: number;
  title: string;
  icon: any;
}

export const Dropdown = ({ options, onSelect, initial, title, icon }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(options[initial]);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);
  const scale = useSharedValue(0);

  const handlePress = (ref: any) => {
    ref?.measure(
      (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setButtonLayout({ x: pageX, y: pageY, width, height });
        handleModal(true);
      }
    );
  };

  const handleModal = (shouldOpen: boolean) => {
    if (shouldOpen) {
      scale.value = 0;
      setOpen(true);
      scale.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(setOpen)(false);
        }
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <>
      <Pressable
        ref={buttonRef}
        onPress={(e) => {
          handlePress(e.currentTarget);
        }}
        className="mx-2 mt-5 h-20 flex-1 flex-row items-center overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 color-white">
        <View className="w-6 flex-row items-center justify-center">
          <FontAwesome name={icon} size={20} color="#a6a6a6" />
        </View>
        <Text className="ml-5 text-[20px] color-white">{title}</Text>

        <Text className="ml-auto text-[20px] text-[#a6a6a6]">
          {String(value).charAt(0).toUpperCase() + String(value.replaceAll('_', ' ')).slice(1)}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="none">
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            handleModal(false);
          }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: buttonLayout.y,
                left: buttonLayout.x + 200,
                // width: buttonLayout.width,
              },
              animatedStyle,
            ]}>
            <GlassView
              style={{
                borderRadius: 30,
                padding: 10,
                width: 150,
              }}>
              <FlatList
                data={options}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setValue(item);
                      onSelect(item); // Call the onSelect prop
                      handleModal(false);
                    }}
                    className="p-3">
                    <Text className="text-[20px] color-white">
                      {String(item).charAt(0).toUpperCase() +
                        String(item.replaceAll('_', ' ')).slice(1)}
                    </Text>
                  </Pressable>
                )}
              />
            </GlassView>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};
