import React, { useEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { useLoadingStore } from '@/store/store';

export const Loading = () => {
  const { isLoading } = useLoadingStore();

  // shared value for opacity
  const opacity = useSharedValue(isLoading ? 1 : 0);

  useEffect(() => {
    if (isLoading) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
    } else {
      opacity.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
    }
  }, [isLoading, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={isLoading ? 'auto' : 'none'}
      className="absolute z-[100] h-full w-full flex-1 items-center justify-center bg-black/50"
      style={animatedStyle}
      renderToHardwareTextureAndroid={Platform.OS === 'android'}
      needsOffscreenAlphaCompositing>
      <ActivityIndicator size="large" color="#fff" />
    </Animated.View>
  );
};
