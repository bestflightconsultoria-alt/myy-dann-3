import { useState } from 'react';
import { BlogPost } from '../types/blog';
import { MOCK_POSTS } from '../data/blogData';

export { type BlogPost } from '../types/blog';
export { MOCK_POSTS } from '../data/blogData';

export const useBlog = () => {
  const [posts] = useState<BlogPost[]>(MOCK_POSTS);

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug);
  };

  const getPostsByCategory = (category: string) => {
    return posts.filter((post) => post.category === category);
  };

  return {
    posts,
    getPostBySlug,
    getPostsByCategory,
  };
};
