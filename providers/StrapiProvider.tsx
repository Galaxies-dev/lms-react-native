import { Course, Lesson, HomeInfo, StrapiUser } from '@/types/interfaces';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

// Define the context type
interface StrapiContextType {
  createUser: (user: StrapiUser) => Promise<StrapiUser>;
  getHomeInfo: () => Promise<HomeInfo>;
  getCourses: () => Promise<Course[]>;
  getCourse: (slug: string) => Promise<Course>;
  getLessonsForCourse: (slug: string) => Promise<Lesson[]>;
  getUserCourses: () => Promise<Course[]>;
  addUserToCourse: (courseId: string) => Promise<void>;
}

// Create the context
const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

export function StrapiProvider({ children }: { children: ReactNode }) {
  const baseUrl = process.env.EXPO_PUBLIC_STRAPI_API_URL as string;
  const { user } = useUser();
  const [activeStrapiUserId, setActiveStrapiUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getActiveStrapiUserIdForClerkId(user.id).then((result) => {
        console.log(' result:', result);
        // Strapi 5: use documentId
        setActiveStrapiUserId(result.id);
      });
    } else {
      console.log('No user');
      setActiveStrapiUserId(null);
    }
  }, [user]);

  const getActiveStrapiUserIdForClerkId = async (clerkId: string) => {
    try {
      console.log('GET ACTIVE USER');

      const response = await fetch(
        `${baseUrl}/api/users?filters[clerkId][$eq]=${clerkId}&populate=courses`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('🚀 ~ getActiveStrapiUserIdForClerkId ~ result:', result);
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

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
      return result.data;
    } catch (error) {
      console.error('Error fetching home info:', error);
      throw error;
    }
  };

  const addUserToCourse = async (courseId: string): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/api/users/${activeStrapiUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courses: [{ id: courseId }] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('🚀 ~ addUserToCourse ~ result:', result);
      return result;
    } catch (error) {
      console.error('Error adding user course:', error);
      throw error;
    }
  };

  const getUserCourses = async (): Promise<Course[]> => {
    try {
      console.log('GET USER COURSES: ', activeStrapiUserId);
      const url = `${baseUrl}/api/users/${activeStrapiUserId}?populate[courses][populate]=image`;
      console.log('🚀 ~ getUserCourses ~ url:', url);
      const response = await fetch(encodeURI(url));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      result.courses.forEach((course: any) => {
        course.image = `${baseUrl}${course.image.url}`;
      });
      console.log('🚀 ~ getUserCourses ~ result:', result);
      return result.courses;
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
    addUserToCourse,
    getCourse,
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
