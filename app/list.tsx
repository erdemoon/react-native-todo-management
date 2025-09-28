import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Button, View, Text } from 'react-native';
import { SearchBarCommands } from 'react-native-screens';

import { Container } from '@/components/Container';
import { MainList } from '@/components/MainList';
import { getTasksByListId, searchTasksByName } from '@/queries/tasks';
import { useListsStore, useLoadingStore, useTasksStore } from '@/store/store';
import { Task } from '@/types';

export default function ListDetails() {
  const router = useRouter();
  const { currentList } = useListsStore();
  const { tasks, setTasks } = useTasksStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const [search, setSearch] = useState<string>('');
  const searchButtonRef = useRef<SearchBarCommands>(null!);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchResults, setSearchResults] = useState<Task[]>();

  useEffect(() => {
    setTasks([]);
    showLoading();
    getTasksByListId(Number(currentList?.id)).then((e) => {
      setTasks(e);
      hideLoading();
    });
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      if (search) {
        showLoading();
        await searchTasksByName(search).then((result) => setSearchResults(result));
        hideLoading();
      }
    }, 1000);

    if (!search) {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search]);

  return (
    <>
      <Stack.Screen
        options={{
          title: currentList?.name,
          headerSearchBarOptions: {
            placement: 'automatic',
            placeholder: 'Search',
            ref: searchButtonRef,
            onChangeText: (query) => {
              setSearch(query.nativeEvent.text);
            },
            onBlur: () => {
              searchButtonRef.current.cancelSearch();
            },
          },
          headerRight: () => (
            <View className="flex-row">
              <Button
                onPress={() => {
                  router.push({
                    pathname: '/listModal',
                    params: { mode: 'edit' },
                  });
                }}
                title="Edit"
                color="white"
              />
              <Button
                onPress={() => {
                  router.push({
                    pathname: '/taskModal',
                    params: { mode: 'add' },
                  });
                }}
                title="Add"
                color="white"
              />
            </View>
          ),
        }}
      />
      <Container>
        <ScrollView className="flex-1 py-4">
          {search && searchResults ? (
            <MainList items={searchResults} type="task" />
          ) : tasks.length > 0 ? (
            <MainList items={tasks} type="task" />
          ) : (
            <View className="justify-centr mt-60 flex-1 items-center">
              <Text className="text-[20px] text-[#a6a6a6]">You dont have any task.</Text>
              <Text className="text-[20px] text-[#a6a6a6]">Add a task!</Text>
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  );
}
