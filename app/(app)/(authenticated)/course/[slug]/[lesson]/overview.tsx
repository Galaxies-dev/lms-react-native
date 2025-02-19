import { View, Text, ActivityIndicator, useWindowDimensions, TouchableOpacity } from 'react-native';
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useStrapi } from '@/providers/StrapiProvider';
import { useQuery } from '@tanstack/react-query';
import RichtTextContent from '@/components/RichtTextContent';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const HEADER_HEIGHT = 200;
const HEADER_SCALE = 1.8;

const Page = () => {
  const { slug } = useGlobalSearchParams<{ slug: string }>();
  const { getCourse } = useStrapi();
  const { width: windowWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourse(slug),
    enabled: !!slug,
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

  return (
    <Animated.ScrollView
      className="bg-white dark:bg-black"
      entering={FadeIn}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}>
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
      <View className="px-4 pt-4 bg-white dark:bg-black flex-1">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">{course.title}</Text>
        <View className="flex-1 py-4 min-h-[100px]">
          <RichtTextContent blockContent={course.description} />
        </View>
      </View>

      <TouchableOpacity
        className="bg-primary py-3 flex-row items-center justify-center pb-safe gap-2"
        onPress={() => router.push(`/course/${course.slug}/1`)}>
        <Text className="text-center text-white font-medium">Start Course</Text>
        <Ionicons name="arrow-forward" size={24} color="white" />
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};

export default Page;
