import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { TextInput, Button, Text, Pressable } from 'react-native';

import { Container } from '@/components/Container';
import { createList, deleteList, getAllLists, updateList } from '@/queries/lists';
import { useListsStore, useLoadingStore } from '@/store/store';

export default function ListModal() {
  const { mode } = useLocalSearchParams();

  const { currentList, setCurrentList, setLists } = useListsStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const navigation = useNavigation();
  const router = useRouter();
  const [value, setValue] = useState<string>(
    mode === 'edit' && currentList ? currentList.name : ''
  );
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleDelete = async () => {
    router.back();
    showLoading();
    await deleteList(Number(currentList?.id));
    await getAllLists().then((e) => {
      setLists(e);
    });
    hideLoading();
    router.back();
  };

  const handleAdd = async () => {
    router.back();
    showLoading();
    switch (mode) {
      case 'edit':
        if (currentList) {
          await updateList(currentList?.id, valueRef.current);
          setCurrentList({ ...currentList, name: valueRef.current });
        }
        break;
      case 'add':
        await createList(valueRef.current);
        break;
      default:
        break;
    }
    await getAllLists().then((e) => {
      setLists(e);
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
        className="mx-2 mt-5 overflow-hidden rounded-[30px] bg-[#2c2c2e] px-6 py-6 text-[20px] color-white"
        onChangeText={setValue}
        value={value}
        placeholder="New List"
        autoFocus
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
