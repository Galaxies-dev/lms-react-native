import { Drawer } from 'expo-router/drawer';
import {
  DrawerContentScrollView,
  DrawerContent,
  DrawerItemList,
  DrawerItem,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Button, Image, View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useStrapi } from '@/providers/StrapiProvider';
import { useLocalSearchParams } from 'expo-router';
import { Lesson } from '@/types/interfaces';
import { Ionicons } from '@expo/vector-icons';

function CustomDrawerContent(props: any) {
  const { getLessonsForCourse } = useStrapi();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { slug } = useLocalSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    getLessonsForCourse(slug as string).then((lessons) => {
      console.log(lessons);
      setLessons(lessons);
    });
  }, [slug]);

  return (
    <View className="flex-1">
      <Image
        source={{ uri: require('@/assets/images/yoga.png') }}
        style={{ width: 100, height: 100 }}
      />
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Text className="text-2xl font-bold p-4">Lessons</Text>
        {lessons.map((lesson) => {
          const isActive = pathname === `/course/${slug}/${lesson.lesson_index}`;
          return (
            <DrawerItem
              key={lesson.lesson_index}
              label={lesson.name}
              onPress={() => router.push(`/course/${slug}/${lesson.lesson_index}`)}
              focused={isActive}
            />
          );
        })}
        <TouchableOpacity
          onPress={() => router.replace(`/my-content`)}
          className="flex-row items-center gap-2 p-4 pt-12">
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-sm">Back to my Content</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      <View className="border-t border-gray-200 p-4 pb-12 items-center">
        <Text className="text-sm text-gray-500">Copyright Simon 2025</Text>
      </View>
    </View>
  );
}

const Layout = () => {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{ drawerActiveTintColor: '#0d6c9a' }}>
      <Drawer.Screen name="overview" options={{ headerShown: true, title: 'Course Overview' }} />
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: {
            display: 'none',
          },
        }}
      />
    </Drawer>
  );
};
export default Layout;
