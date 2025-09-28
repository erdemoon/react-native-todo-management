import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TextInput, Button, Text, Pressable } from 'react-native';

import { Container } from '@/components/Container';
import { DatePicker } from '@/components/DatePicker';
import { Dropdown } from '@/components/Drapdown';
import { ImagePicker } from '@/components/ImagePicker';
import { createTask, deleteTask, getAllTasks, getTasksByListId, updateTask } from '@/queries/tasks';
import { useListsStore, useLoadingStore, useTasksStore } from '@/store/store';

// import { Task } from '@/types';

interface Task {
  id?: number;
  name: string;
  description?: string | null;
  image?: string | null;
  status?: string | null;
  priority?: string | null;
  is_completed?: boolean | null;
  due_date?: string | null;
  list_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewTask {
  name: string;
  description?: string;
  image?: string;
  status?: string;
  priority?: string;
  is_completed?: boolean;
  due_date?: string;
  list_id: number;
}

export default function CreateModal() {
  const { mode } = useLocalSearchParams();

  const { currentList } = useListsStore();

  const { currentTask, setTasks, setCurrentTask } = useTasksStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const initTask = useRef<Partial<Task>>({
    description: undefined,
    due_date: undefined,
    image: undefined,
    name: '',
    priority: 'medium',
    status: 'pending',
    list_id: Number(currentList?.id),
  });

  const navigation = useNavigation();
  const router = useRouter();
  const [task, setTask] = useState<Partial<Task>>(
    mode === 'edit' && currentTask ? currentTask : initTask.current
  );

  const taskRef = useRef(task);

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  const handleDelete = async () => {
    router.back();
    showLoading();
    await deleteTask(Number(currentTask?.id));
    await getAllTasks().then((e) => {
      setTasks(e);
    });
    hideLoading();
    router.back();
  };

  const handleAdd = async () => {
    router.back();
    showLoading();
    switch (mode) {
      case 'edit':
        if (currentTask) {
          await updateTask(currentTask?.id, taskRef.current as NewTask);
          setCurrentTask({ ...currentTask, ...taskRef.current });
        }
        break;
      case 'add':
        await createTask(taskRef.current as NewTask);
        break;
      default:
        break;
    }
    await getTasksByListId(Number(currentList?.id)).then((e) => {
      setTasks(e);
    });
    hideLoading();
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => {
            router.back();
          }}
          title="Back"
          color="white"
        />
      ),
      headerRight: () => <Button onPress={handleAdd} title="Done" color="white" />,
    });
  }, [navigation]);

  return (
    <Container className="bg-[#1c1c1e]">
      <TextInput
        className="mx-2 mt-5 h-20 overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 text-[20px] color-white"
        onChangeText={(value) => setTask((prevState) => ({ ...prevState, name: value }))}
        placeholder="New Task"
        value={task.name}
        autoFocus
      />

      <TextInput
        className="mx-2 mt-5 h-40 overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 py-6 text-[20px] color-white"
        onChangeText={(value) => setTask((prevState) => ({ ...prevState, description: value }))}
        placeholder="Description"
        value={task.description as string}
        multiline
      />
      {mode === 'add' && (
        <Dropdown
          options={['pending', 'not_started', 'in_progress', 'completed']}
          onSelect={(value) => setTask((prevState) => ({ ...prevState, status: value }))}
          initial={0}
          title="Status"
          icon="circle-o"
        />
      )}
      {mode === 'add' && (
        <Dropdown
          options={['low', 'medium', 'high']}
          onSelect={(value) => setTask((prevState) => ({ ...prevState, priority: value }))}
          initial={1}
          title="Priority"
          icon="exclamation"
        />
      )}
      <DatePicker
        onSelect={(value) => setTask((prevState) => ({ ...prevState, due_date: value }))}
        initValue={task.due_date as string}
      />
      <ImagePicker
        onSelect={(value) => setTask((prevState) => ({ ...prevState, image: value }))}
        initValue={task.image as string}
      />

      {mode === 'edit' ? (
        <Pressable
          onPress={handleDelete}
          className="mx-20 mt-10 items-center justify-center overflow-hidden rounded-[30px] bg-[#e60246] py-6 color-white">
          <Text className="text-[20px] text-white">Delete</Text>
        </Pressable>
      ) : (
        <></>
      )}
    </Container>
  );
}
