import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useStrapi } from '@/providers/StrapiProvider';
import RichtTextContent from '@/components/RichtTextContent';
import { useEventListener } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Confetti, ConfettiMethods } from 'react-native-fast-confetti';
import { useRef } from 'react';

const Page = () => {
  const { slug, lesson: lessonIndex } = useLocalSearchParams<{ slug: string; lesson: string }>();
  const { getLessonForCourse, markLessonAsCompleted, getLessonsForCourse } = useStrapi();
  const player = useVideoPlayer(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const confettiRef = useRef<ConfettiMethods>(null);

  useEventListener(player, 'playToEnd', () => {
    onHandleCompleteLesson();
  });

  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', slug, lessonIndex],
    queryFn: () => getLessonForCourse(slug, parseInt(lessonIndex)),
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons', slug],
    queryFn: () => getLessonsForCourse(slug as string),
  });

  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#0d6c9a" />
      </View>
    );
  }

  const hasNextLesson = lessons?.find((l) => l.lesson_index === parseInt(lessonIndex) + 1);

  player.replace(lesson.video);
  // player.play();

  const onHandleCompleteLesson = () => {
    const progress = Math.floor((parseInt(lessonIndex) / (lessons?.length || 0)) * 100);

    markLessonAsCompleted(
      lesson.documentId,
      lesson.course.documentId,
      progress,
      parseInt(lessonIndex) + 1
    );

    queryClient.invalidateQueries({ queryKey: ['lessons', slug] });
    router.push(`/course/${slug}/${parseInt(lessonIndex) + 1}`);
  };

  const onEndCourse = () => {
    confettiRef.current?.restart();
    markLessonAsCompleted(lesson.documentId, lesson.course.documentId, 100);
    queryClient.invalidateQueries({ queryKey: ['lessons', slug] });

    setTimeout(() => {
      router.replace(`/my-content`);
    }, 4000);
  };

  return (
    <View className="flex-1">
      <Confetti
        ref={confettiRef}
        autoplay={false}
        fallDuration={8000}
        verticalSpacing={20}
        fadeOutOnEnd
      />

      <Stack.Screen options={{ title: lesson?.name }} />
      <VideoView
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        style={{ width: '100%', height: 250 }}
        contentFit="fill"
      />

      <View className="flex-1 p-4 min-h-[100px]">
        <RichtTextContent blockContent={lesson.notes} />
      </View>
      {hasNextLesson && (
        <TouchableOpacity
          className="bg-primary py-3 flex-row items-center justify-center pb-safe gap-2"
          onPress={onHandleCompleteLesson}>
          <Text className="text-center text-white font-medium">Complete & Next Lesson</Text>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      )}
      {!hasNextLesson && (
        <TouchableOpacity
          className="bg-primary py-3 flex-row items-center justify-center pb-safe gap-2"
          onPress={onEndCourse}>
          <Text className="text-center text-white font-medium">Complete Course</Text>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default Page;
