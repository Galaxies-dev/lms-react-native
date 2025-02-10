import { FlatList, Text, View } from 'react-native';
import { useStrapi } from '@/providers/StrapiProvider';
import { Course } from '@/types/interfaces';
import { useEffect, useState } from 'react';

export default function Index() {
  const { getCourses } = useStrapi();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await getCourses();
      setCourses(courses);
    };
    fetchCourses();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FlatList data={courses} renderItem={({ item }) => <Text>{item.title}</Text>} />
    </View>
  );
}
