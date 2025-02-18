import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Course } from '../types/interfaces';

type CourseCardProps = Course & { openLesson?: string };

export default function CourseCard({
  title,
  image,
  slug,
  isPremium,
  openLesson,
}: CourseCardProps) {
  return (
    <Link href={openLesson ? `/course/${slug}/${openLesson}` : `/course/${slug}`} asChild>
      <Pressable className="mb-4">
        <View
          className={`bg-white rounded-2xl shadow-md overflow-hidden ${
            isPremium ? 'border-2 border-yellow-400' : ''
          }`}>
          <View className="relative">
            <Image source={{ uri: image }} className="w-full h-48" resizeMode="cover" />
            <View
              className={`absolute top-2 right-2 px-2 py-1 rounded-full ${
                isPremium ? 'bg-yellow-400' : 'bg-dark'
              }`}>
              {isPremium && <Text className="text-xs font-semibold text-white">PREMIUM</Text>}
              {!isPremium && <Text className="text-xs font-semibold text-white">FREE</Text>}
            </View>
          </View>
          <View className="p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">{title}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
