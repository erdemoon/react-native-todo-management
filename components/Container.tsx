import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';

export const Container = ({
  children,
  className = 'bg-black',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className="flex-1 bg-transparent">
      <StatusBar style="light" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className={styles.container + ` ${className}`}>
        {children}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: 'flex flex-1 pb-6 pr-2 pl-2',
};
