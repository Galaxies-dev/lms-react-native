import { Stack } from 'expo-router';
import { Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const Layout = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerTintColor: '#0d6c9a',
        headerTitleStyle: {
          color: colorScheme === 'dark' ? '#fff' : '#000',
        },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="courses"
        options={{
          headerBackTitle: 'Back',
          title: 'Courses',
          headerShown: Platform.OS === 'web' ? false : true,
        }}
      />
      <Stack.Screen
        name="course/[slug]/index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBackVisible: false,
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.dismiss()}
              className="p-2 bg-white/25 rounded-full">
              <Ionicons name="close" size={22} color="black" />
            </TouchableOpacity>
          ),
          presentation: 'formSheet',
          gestureDirection: 'vertical',
          animation: 'slide_from_bottom',
          sheetGrabberVisible: false,
          sheetInitialDetentIndex: 1,
          sheetAllowedDetents: [0.5, 1.0],
        }}
      />
      <Stack.Screen
        name="course/[slug]/[lesson]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
export default Layout;
