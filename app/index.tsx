import { Stack, useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { ScrollView, Button, Text, View, Pressable } from 'react-native';
import { SearchBarCommands } from 'react-native-screens';

// import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { MainList } from '@/components/MainList';
import { getAllLists, searchListsByName } from '@/queries/lists';
import { useListsStore, useLoadingStore } from '@/store/store';
import { List } from '@/types';

export default function Home() {
  const router = useRouter();
  const { lists, setLists } = useListsStore();
  const [search, setSearch] = useState<string>('');
  const searchButtonRef = useRef<SearchBarCommands>(null!);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchResults, setSearchResults] = useState<List[]>();

  const { showLoading, hideLoading } = useLoadingStore();

  useEffect(() => {
    showLoading();
    getAllLists().then((e) => {
      setLists(e);
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
        await searchListsByName(search).then((result) => setSearchResults(result));
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
          title: 'My Lists',
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
            <Button
              onPress={() => {
                router.push({
                  pathname: '/listModal',
                  params: { mode: 'add' },
                });
              }}
              title="Add"
              color="white"
            />
          ),
        }}
      />
      <Container>
        <ScrollView className="flex-1 py-4">
          {search && searchResults ? (
            <MainList items={searchResults} type="main" />
          ) : lists.length > 0 ? (
            <>
              <View className="mx-2 mt-5 overflow-hidden rounded-[30px] bg-[#1c1c1e]">
                <Pressable
                  className="mx-6 flex-row items-center justify-between bg-[#1c1c1e] py-5"
                  onPress={() => {
                    router.push({
                      pathname: '/filter',
                      params: { filterType: 'status' },
                    });
                  }}>
                  <Text className="flex-1 text-[20px] text-white">All tasks by status</Text>
                  <Text className="text-[22px] font-light text-gray-400">›</Text>
                </Pressable>
                <Pressable
                  className="mx-6 flex-row items-center justify-between border-t-[1px] border-[#2c2c2e] bg-[#1c1c1e] py-5"
                  onPress={() => {
                    router.push({
                      pathname: '/filter',
                      params: { filterType: 'priority' },
                    });
                  }}>
                  <Text className="flex-1 text-[20px] text-white">All tasks by priority</Text>
                  <Text className="text-[22px] font-light text-gray-400">›</Text>
                </Pressable>
              </View>
              <MainList items={lists} type="main" />
            </>
          ) : (
            <View className="justify-centr mt-60 flex-1 items-center">
              <Text className="text-[20px] text-[#a6a6a6]">You dont have any list.</Text>
              <Text className="text-[20px] text-[#a6a6a6]">Add a list!</Text>
            </View>
          )}
        </ScrollView>
      </Container>
    </>
  );
}
