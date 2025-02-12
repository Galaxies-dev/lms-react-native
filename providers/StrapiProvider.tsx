import { Course, Lesson, HomeInfo, StrapiUser } from '@/types/interfaces';
import { createContext, useContext, ReactNode } from 'react';

// Define the context type
interface StrapiContextType {
  createUser: (user: StrapiUser) => Promise<StrapiUser>;
  getHomeInfo: () => Promise<HomeInfo>;
  getCourses: () => Promise<Course[]>;
  getLessonsForCourse: (courseId: string) => Promise<Lesson[]>;
  getUserCourses: () => Promise<Course[]>;
}

// Create the context
const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

export function StrapiProvider({ children }: { children: ReactNode }) {
  const baseUrl = process.env.EXPO_PUBLIC_STRAPI_API_URL as string;

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
      const response = await fetch(`${baseUrl}/api/courses?populate=*`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching data from Strapi:', error);
      throw error;
    }
  };

  const getLessonsForCourse = async (courseId: string): Promise<Lesson[]> => {
    try {
      const response = await fetch(`${baseUrl}/api/lessons?filters[course][id][$eq]=${courseId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🚀 ~ getLessonsForCourse ~ result:', result);
      return result.data;
    } catch (error) {
      console.error('Error fetching lessons for course:', error);
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
      console.log('🚀 ~ getHomeInfo ~ result:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching home info:', error);
      throw error;
    }
  };

  const getUserCourses = async (): Promise<Course[]> => {
    try {
      const response = await fetch(`${baseUrl}/api/user-courses`);

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      const result = await response.json();
      return [];
    } catch (error) {
      console.error('Error fetching user courses:', error);
      throw error;
    }
  };

  const value = {
    createUser,
    getCourses,
    getLessonsForCourse,
    getHomeInfo,
    getUserCourses,
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
