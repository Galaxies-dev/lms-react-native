import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
const Page = () => {
  const { slug, lesson } = useLocalSearchParams();
  console.log('🚀 ~ slug:', slug);
  console.log('🚀 ~ lesson:', lesson);
  return (
    <View>
      <Text>Lesson: {lesson}</Text>
    </View>
  );
};
export default Page;
