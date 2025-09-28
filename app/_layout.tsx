import '../global.css';

import { Stack } from 'expo-router';

import { Loading } from '@/components/Loading';
import DatabaseProvider from '@/providers/database-provider';

export default function Layout() {
  return (
    <DatabaseProvider>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerBackButtonDisplayMode: 'minimal',
          headerLargeTitle: true,
          headerTitleStyle: {
            color: 'white',
          },
        }}>
        <Stack.Screen
          name="listModal"
          options={{
            title: 'New List',
            headerLargeTitle: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="taskModal"
          options={{
            title: 'New Task',
            headerLargeTitle: false,
            presentation: 'modal',
          }}
        />
      </Stack>
      <Loading />
    </DatabaseProvider>
  );
}
