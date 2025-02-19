import { View, ActivityIndicator, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import HomeBlock from '@/components/HomeBlock';
import { Stack } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const { getHomeInfo } = useStrapi();
  const [isLoading, setIsLoading] = useState(Platform.OS === 'web' ? false : true);

  const { data } = useQuery({
    queryKey: ['homeInfo'],
    queryFn: () => getHomeInfo(),
  });

  return (
    <View className="h-full flex-1">
      <Stack.Screen options={{ title: data?.title }} />
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
      <HomeBlock
        homeInfo={data!}
        dom={{
          scrollEnabled: false,
          matchContents: true,
          onLoadEnd: () => {
            setIsLoading(false);
          },
        }}
      />
    </View>
  );
}
