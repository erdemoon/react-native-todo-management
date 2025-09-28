import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useListsStore, useTasksStore } from '@/store/store';
import { List, Task } from '@/types';

interface ListItemProps {
  item: Task | List;
  index: number;
  onPress: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ item, index, onPress }) => (
  <Pressable
    className={`mx-6 flex-row items-center bg-[#1c1c1e] py-5 ${index !== 0 ? 'border-t-[1px] border-[#2c2c2e]' : ''}`}
    onPress={onPress}>
    <Text className="text-[20px] text-white">{item.name}</Text>
    {'image' in item && item.image && (
      <Image
        className="mx-5 h-12 w-12 rounded-md"
        source={{
          uri: item.image,
        }}
      />
    )}
    <Text className="ml-auto text-[22px] font-light text-gray-400">›</Text>
  </Pressable>
);

const MainList = ({ items, type }: { items: List[] | Task[]; type: 'main' | 'task' }) => {
  const router = useRouter();
  const fade = useSharedValue(0);
  const { setCurrentList } = useListsStore();
  const { setCurrentTask } = useTasksStore();

  // trigger fade whenever items change
  useEffect(() => {
    if (items.length > 0) {
      fade.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
    } else {
      fade.value = 0; // instantly hide if empty
    }
  }, [items, fade]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="mx-2 mt-5 overflow-hidden rounded-[30px] bg-[#1c1c1e]">
      {items.toReversed().map((item: List | Task, index: number) => (
        <ListItem
          key={index}
          index={index}
          item={item}
          onPress={() => {
            if (type === 'main') {
              setCurrentList(item);
              router.push({
                pathname: '/list',
              });
            } else if (type === 'task') {
              setCurrentTask(item as Task);
              router.push({
                pathname: '/task',
              });
            }
          }}
        />
      ))}
    </Animated.View>
  );
};

export { MainList };
