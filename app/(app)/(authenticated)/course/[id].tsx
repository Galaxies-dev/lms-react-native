import { View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useStrapi } from '@/providers/StrapiProvider';
import { Lesson } from '@/types/interfaces';
import { useEffect, useState } from 'react';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getLessonsForCourse } = useStrapi();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      const lessons = await getLessonsForCourse(id);
      setLessons(lessons);
    };
    fetchLessons();
  }, [id]);

  return (
    <View className="flex-1 items-center justify-center">
      <FlatList data={lessons} renderItem={({ item }) => <Text>{item.name}</Text>} />
    </View>
  );
};
export default Page;
