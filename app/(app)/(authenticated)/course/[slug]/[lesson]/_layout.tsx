import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useStrapi } from '@/providers/StrapiProvider';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useQuery } from '@tanstack/react-query';

function CustomDrawerContent(props: any) {
  const { getLessonsForCourse } = useStrapi();
  const { slug } = useLocalSearchParams();
  const pathname = usePathname();

  const { data: lessons } = useQuery({
    queryKey: ['lessons', slug],
    queryFn: () => getLessonsForCourse(slug as string),
  });

  if (!lessons) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 py-safe">
      <Image
        source={require('@/assets/images/yoga.png')}
        style={{ width: 200, height: 100, alignSelf: 'center' }}
        resizeMode="contain"
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
              icon={({ color, size }) =>
                lesson.completed ? (
                  <Entypo name="check" size={size} color={color} />
                ) : (
                  <Entypo name="circle" size={size} color={color} />
                )
              }
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

      <View className="border-t border-gray-200 pt-4  items-center">
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
      <Drawer.Screen
        name="overview"
        options={{
          headerShown: true,
          title: 'Course Overview',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
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
