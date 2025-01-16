import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-card">
      <img src={blog.image_url} alt={blog.title} />
      <h3>{blog.title}</h3>
      <p>By {blog.author}</p>
      <p>{blog.content.substring(0, 100)}...</p>
      <button onClick={() => navigate(`/blogs/${blog.id}`)}>View Details</button>
    </div>
  );
};

export default BlogCard;
