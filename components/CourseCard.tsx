import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Course } from '@/types/interfaces';

type CourseCardProps = Course & {
  openLesson?: string;
  finished_percentage?: number;
  hasCourse?: boolean;
};

export default function CourseCard({
  title,
  image,
  slug,
  isPremium,
  openLesson,
  finished_percentage,
  hasCourse = false,
}: CourseCardProps) {
  return (
    <Link href={openLesson ? `/course/${slug}/${openLesson}` : `/course/${slug}`} asChild>
      <Pressable className="mb-4 hover:opacity-80">
        <View
          className={`bg-white dark:bg-black rounded-2xl shadow-md overflow-hidden web:min-h-[300px] ${
            isPremium ? 'border-2 border-yellow-400' : ''
          }`}>
          <View className="relative">
            <Image source={{ uri: image }} className="w-full h-48" resizeMode="cover" />
            {!finished_percentage && (
              <View
                className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
                  isPremium ? 'bg-yellow-400' : 'bg-dark'
                }`}>
                {isPremium && <Text className="text-xs font-semibold text-white">PREMIUM</Text>}
                {!isPremium && <Text className="text-xs font-semibold text-white">FREE</Text>}
              </View>
            )}
          </View>
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {title}
            </Text>
          </View>
          {hasCourse && (
            <View className="px-4 pb-4">
              <Text className="text-xs font-semibold text-gray-800 dark:text-white mb-2">
                {finished_percentage || 0}%
              </Text>
              <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${finished_percentage || 0}%` }}
                />
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
