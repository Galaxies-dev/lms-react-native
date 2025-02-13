import { View } from 'react-native';
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
    </View>
  );
};
export default Page;
