import FontAwesome from '@react-native-vector-icons/fontawesome';
import { Stack, useRouter } from 'expo-router';
import { useRef } from 'react';
import { View, Text, Button, Image } from 'react-native';

import { Container } from '@/components/Container';
import { Dropdown } from '@/components/Drapdown';
import { getTasksByListId, updateTask } from '@/queries/tasks';
import { useListsStore, useLoadingStore, useTasksStore } from '@/store/store';

export default function TaskDetails() {
  const router = useRouter();

  const { currentList } = useListsStore();
  const { currentTask, setTasks } = useTasksStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const statusOptions = useRef(['pending', 'not_started', 'in_progress', 'completed']);
  const priorityOptions = useRef(['low', 'medium', 'high']);

  const handleUpdate = async (label: string, value: string) => {
    showLoading();
    await updateTask(Number(currentTask?.id), { [label]: value });
    await getTasksByListId(Number(currentList?.id)).then((e) => {
      setTasks(e);
    });
    hideLoading();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: currentTask?.name,
          headerRight: () => (
            <>
              <Button
                onPress={() => {
                  router.push({
                    pathname: '/taskModal',
                    params: { mode: 'edit' },
                  });
                }}
                title="Edit"
                color="white"
              />
            </>
          ),
        }}
      />
      <Container>
        <View className="my-4 items-center">
          {currentTask?.image && (
            <Image className="h-60 w-60 rounded-[30px]" source={{ uri: currentTask.image }} />
          )}
        </View>
        {currentTask?.description && (
          <View className="mx-2 mt-5 min-h-20 flex-row items-center overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 py-6 text-[20px] color-white">
            <Text className="flex-1 text-[20px] text-white">{currentTask?.description}</Text>
          </View>
        )}
        {currentTask?.status && (
          <Dropdown
            options={statusOptions.current}
            onSelect={(value) => handleUpdate('status', value)}
            initial={statusOptions.current.indexOf(currentTask.status)}
            title="Status"
            icon="circle-o"
          />
        )}
        {currentTask?.priority && (
          <Dropdown
            options={priorityOptions.current}
            onSelect={(value) => handleUpdate('priority', value)}
            initial={priorityOptions.current.indexOf(currentTask.priority)}
            title="Priority"
            icon="exclamation"
          />
        )}
        {currentTask?.due_date && (
          <View className="mx-2 mt-5 h-20 flex-row items-center overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 py-6 text-[20px] color-white">
            <View className="w-6 flex-row items-center justify-center">
              <FontAwesome name="calendar" size={20} color="#a6a6a6" />
            </View>
            <Text className="ml-5 text-[20px] text-white">Due Date</Text>
            <Text className="ml-auto text-[20px] text-[#a6a6a6]">
              {new Date(currentTask?.due_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </Container>
    </>
  );
}
