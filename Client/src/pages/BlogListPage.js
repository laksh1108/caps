import React from 'react';
import { useGetAllBlogsQuery } from '../redux/api'; 
import BlogCard from '../components/BlogCard';

const BlogListPage = () => {
 
  const { data: blogs, error, isLoading } = useGetAllBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true, 
    refetchOnFocus: true, 
  });

  if (isLoading) {
    return <h2>Loading blogs...</h2>;
  }

  if (error) {
    return <h2>Error loading blogs</h2>;
  }

  return (
    <div className="blog-list">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogListPage;
