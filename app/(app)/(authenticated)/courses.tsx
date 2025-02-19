import { Platform, ScrollView, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import CourseCard from '@/components/CourseCard';
import Animated, { FadeIn } from 'react-native-reanimated';

const Page = () => {
  const { getCourses } = useStrapi();
  const { data } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  });

  return (
    <View className="flex-1 px-4">
      {Platform.OS === 'web' ? (
        <ScrollView contentContainerClassName="web:max-w-[1200px] web:mx-auto">
          <View className="flex-row flex-wrap gap-4 p-4">
            {data?.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeIn.delay(index * 400).duration(800)}
                className="w-full md:flex-1">
                <CourseCard {...item} />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Animated.FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(index * 400).duration(800)}>
              <CourseCard {...item} />
            </Animated.View>
          )}
          contentContainerClassName="pt-4"
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};
export default Page;
