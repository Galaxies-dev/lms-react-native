import { useStrapi } from '@/providers/StrapiProvider';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function HomeScreen() {
  const { getUserCourses } = useStrapi();
  const { data, isLoading } = useQuery({
    queryKey: ['userCourses'],
    queryFn: () => getUserCourses(),
  });

  return (
    <View className="flex-1">
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
    </View>
  );
}
