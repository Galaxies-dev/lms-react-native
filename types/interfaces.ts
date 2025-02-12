import { BlocksContent } from '@strapi/blocks-react-renderer';

export interface Course {
  id: number;
  title: string;
  description: any;
  publishedAt: string;
  image: string;
  slug: string;
}

export interface Lesson {
  id: number;
  name: string;
  description: any;
  publishedAt: string;
  course: Course;
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
