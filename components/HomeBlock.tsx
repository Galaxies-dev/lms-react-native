'use dom';
import { HomeInfo } from '@/types/interfaces';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import '@/global.css';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';

export default function HomeBlock({
  homeInfo,
}: {
  homeInfo: HomeInfo;
  dom: import('expo/dom').DOMProps;
}) {
  const blockContent = homeInfo?.content;

  return (
    <Animated.View className="w-full pb-14" entering={FadeIn.duration(200).easing(Easing.ease)}>
      <Image source={{ uri: homeInfo?.image }} className="w-full h-40" />
      <View className="p-4">{blockContent && <BlocksRenderer content={blockContent} />}</View>
      <Link href="/courses" asChild>
        <TouchableOpacity className="bg-primary p-4 px-8 rounded-md mx-auto flex-row items-center justify-center gap-4">
          <FontAwesome5 name="yin-yang" size={24} color="white" className="animate-spin" />
          <Text className="text-center text-white font-bold">Browse Courses</Text>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
}
