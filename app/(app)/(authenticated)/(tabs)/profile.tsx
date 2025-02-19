import { View, Text, Button, Image, ScrollView } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';

const Page = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { getUserCourses, getUserCompletedLessons } = useStrapi();

  const { data: userCourses } = useQuery({
    queryKey: ['userCourses'],
    queryFn: () => getUserCourses(),
  });

  const { data: completedLessons } = useQuery({
    queryKey: ['userCompletedLessons'],
    queryFn: () => getUserCompletedLessons(),
  });

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView className="web:mx-auto">
        <View className="flex-row items-center mb-6">
          <Image source={{ uri: user?.imageUrl }} className="w-20 h-20 rounded-full mr-4" />
          <View className="flex-1">
            <Text className="text-md font-bold mb-1">
              {user?.primaryEmailAddress?.emailAddress}
            </Text>
            <Text className="text-base text-gray-600">
              User since {new Date(user?.createdAt!).toDateString()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-around mb-6 py-4 bg-gray-100 rounded-xl">
          <View className="items-center">
            <Text className="text-2xl font-bold mb-1">{userCourses?.length}</Text>
            <Text className="text-sm text-gray-600">Courses</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold mb-1">{completedLessons}</Text>
            <Text className="text-sm text-gray-600">Lessons</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-bold mb-4">Recent Activity</Text>
          <View className="space-y-4">
            <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                <Text className="text-blue-500 font-bold">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium">Completed "Sun Salutation Flow"</Text>
                <Text className="text-gray-500 text-sm">2 hours ago</Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                <Text className="text-green-500 font-bold">★</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium">Started "Mindful Meditation Basics"</Text>
                <Text className="text-gray-500 text-sm">Yesterday</Text>
              </View>
            </View>

            <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                <Text className="text-purple-500 font-bold">⚡</Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium">Completed "Breathing Techniques for Beginners"</Text>
                <Text className="text-gray-500 text-sm">3 days ago</Text>
              </View>
            </View>
          </View>
        </View>

        <Button title="Sign Out" onPress={() => signOut()} color="#FF3B30" />
      </ScrollView>
    </View>
  );
};

export default Page;
