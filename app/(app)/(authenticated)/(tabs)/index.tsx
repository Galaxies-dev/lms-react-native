import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import HomeBlock from '@/components/HomeBlock';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  const { getHomeInfo } = useStrapi();
  const { data, isLoading } = useQuery({
    queryKey: ['homeInfo'],
    queryFn: () => getHomeInfo(),
  });

  return (
    <View className="h-full">
      <Stack.Screen options={{ title: data?.title }} />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <HomeBlock
          homeInfo={data!}
          dom={{
            scrollEnabled: false,
          }}
        />
      )}
    </View>
  );
}
