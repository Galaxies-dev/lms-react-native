import { useStrapi } from '@/providers/StrapiProvider';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Animated, { FadeIn } from 'react-native-reanimated';
import CourseCard from '@/components/CourseCard';

export default function HomeScreen() {
  const { getUserCourses } = useStrapi();
  const { data } = useQuery({
    queryKey: ['userCourses'],
    queryFn: () => getUserCourses(),
  });

  return (
    <View className="flex-1 web:max-w-[1200px] web:mx-auto">
      {data?.length === 0 && (
        <View className="flex-1 gap-4 items-center justify-center">
          <Text className="text-center text-lg  dark:text-white">
            You don't have any courses yet.
          </Text>
          <Link href="/courses" asChild>
            <TouchableOpacity className="bg-primary p-4 px-8 rounded-md mx-auto flex-row items-center justify-center gap-4">
              <FontAwesome5 name="yin-yang" size={24} color="white" className="animate-spin" />
              <Text className="text-center text-white font-bold">Browse Courses</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerClassName="web:max-w-[1200px] web:mx-auto">
          <View className="flex-row flex-wrap gap-4 p-4">
            {data?.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeIn.delay(index * 400).duration(800)}
                className="flex-1">
                <CourseCard
                  {...item.course}
                  finished_percentage={item.finished_percentage}
                  hasCourse={true}
                  openLesson={
                    item.finished_percentage === 100
                      ? 'overview/overview'
                      : item.next_lesson_index || 'overview/overview'
                  }
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Animated.FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(index * 400).duration(800)}>
              <CourseCard
                {...item.course}
                finished_percentage={item.finished_percentage}
                hasCourse={true}
                openLesson={
                  item.finished_percentage === 100
                    ? 'overview/overview'
                    : item.next_lesson_index || 'overview/overview'
                }
              />
            </Animated.View>
          )}
          contentContainerClassName="pt-4 px-4"
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
