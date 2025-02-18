import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useVideoPlayer } from 'expo-video';

const Page = () => {
  const { slug, lesson } = useLocalSearchParams();
  console.log('🚀 ~ slug:', slug);
  console.log('🚀 ~ lesson:', lesson);
  // const player = useVideoPlayer(videoSource, player => {
  //   player.loop = true;
  //   player.play();
  // });

  return (
    <View>
      <Text>Lesson: {lesson}</Text>
    </View>
  );
};
export default Page;
