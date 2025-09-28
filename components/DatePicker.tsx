import RNDateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useEffect, useState } from 'react';
import { View, Switch, Text } from 'react-native';

export const DatePicker = ({
  onSelect,
  initValue,
}: {
  onSelect: (value: string | undefined) => void;
  initValue?: string;
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(!!initValue);
  const [value, setValue] = useState<Date>(initValue ? new Date(initValue) : new Date());
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  useEffect(() => {
    onSelect(isEnabled ? value.toISOString() : undefined);
  }, [value, isEnabled]);

  return (
    <View className="mx-2 mt-5 h-20 flex-row items-center overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 text-[20px] color-white">
      <View className="w-6 flex-row items-center justify-center">
        <FontAwesome name="calendar" size={20} color="#a6a6a6" />
      </View>
      <Text className="ml-5 text-[20px] color-white">Due</Text>
      {isEnabled ? (
        <RNDateTimePicker
          value={value}
          onChange={(e, value) => {
            if (value instanceof Date) setValue(value);
          }}
          minimumDate={new Date()}
        />
      ) : (
        <></>
      )}
      <Switch className="my-auto ml-auto" onValueChange={toggleSwitch} value={isEnabled} />
    </View>
  );
};
