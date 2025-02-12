import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="courses" options={{ headerBackTitle: 'Back', title: 'Courses' }} />
    </Stack>
  );
};
export default Layout;
