import { Course } from '@/types/interfaces';
import { createContext, useContext, ReactNode } from 'react';

// Define the context type
interface StrapiContextType {
  getCourses: () => Promise<Course[]>;
}

// Create the context
const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

export function StrapiProvider({ children }: { children: ReactNode }) {
  const baseUrl = process.env.EXPO_PUBLIC_STRAPI_API_URL as string;

  const getCourses = async (): Promise<Course[]> => {
    try {
      const response = await fetch(`${baseUrl}/api/articles`, {});

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

  const value = {
    getCourses,
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
