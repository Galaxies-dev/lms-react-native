import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import RichtTextContent from '@/components/RichtTextContent';
import {  useEventListener } from 'expo';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const { slug, lesson: lessonIndex } = useLocalSearchParams<{ slug: string, lesson: string }>();
  const { getLessonForCourse, markLessonAsCompleted } = useStrapi();
  const player = useVideoPlayer(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEventListener(player, 'playToEnd', () => {
    onHandleCompleteLesson();
  });

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', slug, lessonIndex],
    queryFn: () => getLessonForCourse(slug, parseInt(lessonIndex)),
  });

  console.log('🚀 ~ slug:', slug);
  console.log('🚀 ~ lesson:', lesson);

  if (!lesson) {
    return <Text>Lesson not found</Text>;
  }

  player.replace(lesson.video);
  player.play();


  const onHandleCompleteLesson = () => {
    console.log('Marking lesson as finished');
    markLessonAsCompleted(lesson.documentId, lesson.course.documentId);

    queryClient.invalidateQueries({ queryKey: ['lessons', slug] });
    router.push(`/course/${slug}/${parseInt(lessonIndex) + 1}`);
  }

  return (
    <View className="flex-1">
      <Stack.Screen options={{ title: lesson?.name }} />
      <VideoView  player={player} allowsFullscreen allowsPictureInPicture style={{width: '100%', height: 250}}  contentFit="fill" />


      <View className="flex-1 p-4 min-h-[100px]">
            <RichtTextContent blockContent={lesson.notes} />
      </View>
      <TouchableOpacity 
          className="bg-primary py-3 flex-row items-center justify-center pb-safe"
          onPress={onHandleCompleteLesson}>
          <Text className="text-center text-white font-medium">
            Complete & Next Lesson
          </Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
    </View>
  );
};
export default Page;
