import { BlocksContent } from '@strapi/blocks-react-renderer';

export interface Course {
  id: number;
  documentId: string;
  title: string;
  description: any;
  publishedAt: string;
  image: string;
  slug: string;
  isPremium: boolean;
  lessons: Lesson[];
  revenuecatId: string;
}

export interface UserCourses {
  id: number;
  documentId: string;
  course: Course;
  finished_percentage: number;
  clerkId: string;
  next_lesson_index?: string;
}

export interface Lesson {
  id: number;
  name: string;
  notes: any;
  publishedAt: string;
  course: Course;
  lesson_index: number;
  video: string;
  documentId: string;
  completed: boolean;
}

export interface HomeInfo {
  title: string;
  content: BlocksContent;
  image: string;
}

export interface StrapiUser {
  email: string;
  username: string;
  password: string;
  clerkId: string;
}
