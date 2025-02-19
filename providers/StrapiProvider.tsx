import { Course, Lesson, HomeInfo, StrapiUser, UserCourses } from '@/types/interfaces';
import { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';

// Define the context type
interface StrapiContextType {
  createUser: (user: StrapiUser) => Promise<StrapiUser>;
  getHomeInfo: () => Promise<HomeInfo>;
  getCourses: () => Promise<Course[]>;
  getCourse: (slug: string) => Promise<Course>;
  getLessonsForCourse: (slug: string) => Promise<Lesson[]>;
  getLessonForCourse: (slug: string, lessonIndex: number) => Promise<Lesson>;
  getUserCourses: () => Promise<UserCourses[]>;
  addUserToCourse: (courseId: string) => Promise<UserCourses>;
  userHasCourse: (courseId: string) => Promise<boolean>;
  markLessonAsCompleted: (
    lessonId: string,
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => Promise<void>;
  getUserCompletedLessons: () => Promise<number>;
}

const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

export function StrapiProvider({ children }: { children: ReactNode }) {
  const baseUrl = process.env.EXPO_PUBLIC_STRAPI_API_URL as string;
  const { user } = useUser();
  const queryClient = useQueryClient();

  const createUser = async (user: StrapiUser): Promise<StrapiUser> => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const getCourses = async (): Promise<Course[]> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses?populate=image`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data = result.data.map((item: any) => ({
        ...item,
        image: `${baseUrl}${item.image.url}`,
      }));

      return result.data;
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      throw error;
    }
  };

  const getCourse = async (slug: string): Promise<Course> => {
    try {
      const response = await fetch(`${baseUrl}/api/courses?filters[slug][$eq]=${slug}&populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      result.data[0] = {
        ...result.data[0],
        image: `${baseUrl}${result.data[0].image.url}`,
      };
      return result.data[0];
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  };

  const getLessonsForCourse = async (slug: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/lessons?filters[course][slug][$eq]=${slug}&sort=lesson_index`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const completedLessons = await getUserCompletedLessonsForCourse(slug);

      result.data.forEach((lesson: any) => {
        lesson.completed = completedLessons.includes(lesson.documentId);
      });

      return result.data;
    } catch (error) {
      console.error('Error fetching lessons for course:', error);
      throw error;
    }
  };

  const getLessonForCourse = async (slug: string, lessonIndex: number): Promise<Lesson> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/lessons?filters[course][slug][$eq]=${slug}&filters[lesson_index][$eq]=${lessonIndex}&populate=*`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data[0].video = `${baseUrl}${result.data[0].video.url}`;
      return result.data[0];
    } catch (error) {
      console.error('Error fetching lessons for course:', error);
      throw error;
    }
  };

  const getUserCompletedLessonsForCourse = async (slug: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/progresses?filters[course][slug][$eq]=${slug}&filters[clerkId][$eq]=${user?.id}&populate=lesson`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.map((item: any) => item.lesson.documentId);
    } catch (error) {
      console.error('Error fetching user completed lessons for course:', error);
      throw error;
    }
  };

  const getHomeInfo = async (): Promise<HomeInfo> => {
    try {
      const response = await fetch(`${baseUrl}/api/home?populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data = {
        ...result.data,
        image: `${baseUrl}${result.data.image.url}`,
      };
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const addUserToCourse = async (courseId: string): Promise<UserCourses> => {
    try {
      const body = {
        courseId,
        clerkId: user?.id,
      };

      const response = await fetch(`/api/add-user-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      const result = await response.json();
      console.log('🚀 ~ addUserToCourse ~ result:', result);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const getUserCourses = async (): Promise<UserCourses[]> => {
    try {
      const url = `${baseUrl}/api/user-courses?filters[clerkId]=${user?.id}&populate[course][populate]=image`;
      const response = await fetch(encodeURI(url));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.data.forEach((entry: any) => {
        entry.course.image = `${baseUrl}${entry.course.image.url}`;
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  const userHasCourse = async (courseId: string): Promise<boolean> => {
    const userCourses = await getUserCourses();
    return userCourses.some((course) => course.course.documentId === courseId);
  };

  const markLessonAsCompleted = async (
    lessonId: string,
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => {
    try {
      const response = await fetch(`${baseUrl}/api/progresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            lesson: lessonId,
            course: courseId,
            clerkId: user?.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Also update user-course with progress and lesson_index
      const userCourse = await getUserCourses();
      const userCourseToUpdate = userCourse.find((course) => course.course.documentId === courseId);
      if (userCourseToUpdate) {
        updateUserCourseProgress(userCourseToUpdate.documentId, progress, nextLessonIndex);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  const updateUserCourseProgress = async (
    courseId: string,
    progress: number,
    nextLessonIndex?: number
  ) => {
    try {
      const response = await fetch(`${baseUrl}/api/user-courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            finished_percentage: progress,
            next_lesson_index: `${nextLessonIndex}`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  };

  const getUserCompletedLessons = async (): Promise<number> => {
    try {
      const response = await fetch(
        `${baseUrl}/api/progresses?filters[clerkId]=${user?.id}&populate=lesson`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filter out duplicate lessons by documentId
      const lessonIds = data.data.map((item: any) => item.lesson.documentId);
      const uniqueLessonIds = [...new Set(lessonIds)];
      return uniqueLessonIds.length;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    createUser,
    getCourses,
    getLessonsForCourse,
    getLessonForCourse,
    getHomeInfo,
    getUserCourses,
    addUserToCourse,
    getCourse,
    userHasCourse,
    markLessonAsCompleted,
    getUserCompletedLessons,
  };

  return <StrapiContext.Provider value={value}>{children}</StrapiContext.Provider>;
}

// Custom hook to use the Strapi context
export function useStrapi() {
  const context = useContext(StrapiContext);
  if (context === undefined) {
    throw new Error('useStrapi must be used within a StrapiProvider');
  }
  return context;
}
