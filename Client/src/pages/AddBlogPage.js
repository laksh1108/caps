import React, { useState } from 'react';
import { useCreateBlogMutation } from '../redux/api'; // RTK Query hook for creating a blog
import { useNavigate } from 'react-router-dom';

const AddBlogPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    imageBase64: '', // Store image as Base64
  });

  const [createBlog] = useCreateBlogMutation();
  const navigate = useNavigate();

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input and convert image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // Validate file size (5MB max)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageBase64: reader.result }); // Set Base64 string
      };
      reader.readAsDataURL(file); // Convert file to Base64
    } else {
      alert('Image must be less than 5MB');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.title && formData.author && formData.content && formData.imageBase64) {
      try {
        // Add imageBase64 to form data (image_url column in backend will store this)
        const blogData = {
          ...formData,
          image_url: formData.imageBase64, // Set Base64 image string for the image_url field
        };

        // Create a new blog with imageBase64
        await createBlog(blogData); // Dispatch the createBlog mutation
        navigate('/'); // Redirect after successful creation
      } catch (error) {
        console.error('Error creating blog:', error.message);
      }
    } else {
      alert('All fields are required!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-blog-form">
      <input
        type="text"
        name="title"
        value={formData.title}
        placeholder="Title"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        placeholder="Author"
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        value={formData.content}
        placeholder="Content"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      <button type="submit">Add Blog</button>
    </form>
  );
};

export default AddBlogPage;
