import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Container } from '@/components/Container';
import { MainList } from '@/components/MainList';
import { getTasksByPriority, getTasksByStatus } from '@/queries/tasks';
import { useLoadingStore } from '@/store/store';
import { Task } from '@/types';

type FilterType = 'status' | 'priority';

export default function Filter() {
  const { filterType } = useLocalSearchParams() as { filterType: FilterType };
  const filterOptions = useRef({
    status: ['pending', 'not_started', 'in_progress', 'completed'],
    priority: ['low', 'medium', 'high'],
  });
  const [tasks, setTasks] = useState<Record<string, Task[]>>();

  const { showLoading, hideLoading } = useLoadingStore();

  useFocusEffect(
    useCallback(() => {
      showLoading();
      const allTasks: Record<string, Task[]> = {};

      Promise.all(
        filterOptions.current[filterType].map(async (value: string) => {
          const tasks =
            filterType === 'status'
              ? await getTasksByStatus(value)
              : await getTasksByPriority(value);
          allTasks[value] = tasks;
        })
      ).then(() => {
        setTasks(allTasks);
        hideLoading();
      });
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: `All task by ${filterType}`,
        }}
      />
      <Container>
        <ScrollView className="flex-1 py-4">
          {tasks &&
            filterOptions.current[filterType].map(
              (key, index) =>
                tasks[key].length > 0 && (
                  <View className="mb-5" key={index}>
                    <Text className="mx-2 text-[25px] text-[#a6a6a6]">
                      {String(filterOptions.current[filterType][index]).charAt(0).toUpperCase() +
                        String(filterOptions.current[filterType][index].replaceAll('_', ' ')).slice(
                          1
                        )}
                    </Text>
                    <MainList items={tasks[key]} type="task" />
                  </View>
                )
            )}
        </ScrollView>
      </Container>
    </>
  );
}
