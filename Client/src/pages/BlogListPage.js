import React from 'react';
import { useGetAllBlogsQuery } from '../redux/api'; 
import BlogCard from '../components/BlogCard';
import { useNavigate } from 'react-router-dom';

const BlogListPage = () => {
  const navigate = useNavigate();

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

  const handleAddPost = () => {
    navigate('/add'); // Replace with the route for your add-post page
  };

  return (
    <>
    {blogs.length === 0 ? (
      <div className="no-blog-container" style={styles.centeredContainer}>
        <div className="add-blog-card" style={styles.addCard}>
          <h3>No blogs found</h3>
          <p>Click below to add your first blog post!</p>
          <button onClick={handleAddPost} style={styles.addButton}>
            Add Post
          </button>
        </div>
      </div>
    ) : (
      <div className="blog-list">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    )}
  </>
  
  );
};

const styles = {
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    backgroundColor: '#f4f4f4', // Optional background color
  },
  addCard: {
    textAlign: 'center',
    padding: '20px',
    margin: '20px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default BlogListPage;
