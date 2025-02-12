import { View, Text, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import { Course } from '@/types/interfaces';

const Page = () => {
  const { getCourses } = useStrapi();
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  });

  const renderItem = ({ item }: { item: Course }) => {
    return <Text>{item.title}</Text>;
  };

  return (
    <View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};
export default Page;
