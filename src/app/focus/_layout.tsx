import { Stack } from 'expo-router';

export default function FocusLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        gestureEnabled: false,
      }}
    />
  );
}
