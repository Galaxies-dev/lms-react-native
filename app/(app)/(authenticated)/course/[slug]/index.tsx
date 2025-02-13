import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useStrapi } from '@/providers/StrapiProvider';
import { useQuery } from '@tanstack/react-query';
import RichtTextContent from '@/components/RichtTextContent';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';

const HEADER_HEIGHT = 200; // Increased height for better parallax effect
const HEADER_SCALE = 1.8; // Maximum scale for the parallax effect

const Page = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { getCourse, addUserToCourse } = useStrapi();
  const { width: windowWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourse(slug),
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [HEADER_SCALE, 1, 1]
    );

    const translateY = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <ActivityIndicator color="#0d6c9a" />
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center mt-10">
        <Text>Course not found</Text>
      </View>
    );
  }

  const onStartCourse = async () => {
    console.log('start course: ', course);
    // TODO: FIX
    // const result = await addUserToCourse(course.documentId.toString());
    // console.log('🚀 ~ onStartCourse ~ result:', result);
    router.replace('/my-content');
    // if (result.status === 'success') {
    //   router.replace(`/course/${slug}`);
    // }
  };

  return (
    <Animated.ScrollView
      className="flex-1 bg-white dark:bg-black"
      onScroll={scrollHandler}
      scrollEventThrottle={16}>
      <View className="relative" style={{ height: HEADER_HEIGHT }}>
        <Animated.Image
          source={{ uri: course.image }}
          className="absolute w-full object-cover"
          style={[
            imageAnimatedStyle,
            {
              height: HEADER_HEIGHT,
              width: windowWidth,
            },
          ]}
          resizeMode="cover"
        />
      </View>

      {/* Course Info Section */}
      <View className="px-4 pt-4 bg-white dark:bg-black">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">{course.title}</Text>

        <Pressable
          onPress={onStartCourse}
          className="mt-4 bg-blue-500 rounded-lg py-3 items-center">
          <Text className="text-white font-semibold text-lg">Start Course</Text>
        </Pressable>

        {Platform.OS === 'web' && (
          <View className="py-4">
            <RichtTextContent blockContent={course.description} />
          </View>
        )}
        {Platform.OS !== 'web' && (
          <View className="my-4 h-40 flex-1">
            <RichtTextContent blockContent={course.description} />
          </View>
        )}

        {/* Lessons Section */}
        <Text className="mt-6 mb-2 text-xl font-semibold text-gray-800 dark:text-white">
          Course Content
        </Text>
      </View>

      {/* Lessons List */}
      <View className="px-4 pb-6">
        {course.lessons.map((lesson) => (
          <View key={lesson.id} className="flex-row items-center py-4 border-b border-gray-100">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Text className="text-gray-600 font-medium">{lesson.lesson_index}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium dark:text-white">{lesson.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.ScrollView>
  );
};

export default Page;
