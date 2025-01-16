import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from "../redux/api";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch blog using RTK Query
  const { data: blog, error, isLoading } = useGetBlogQuery(id);

  // RTK Query mutations for update and delete
  const [updateBlog, { isLoading: isUpdateLoading }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleteLoading }] = useDeleteBlogMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    author: "",
    content: "",
    image: "", // Store image URL or base64 string here
  });

  const [imagePreview, setImagePreview] = useState("");

  // Populate form state when blog data is fetched
  useEffect(() => {
    if (blog) {
      setFormState({
        id: blog.id,
        title: blog.title,
        author: blog.author,
        content: blog.content,
        image: blog.image_url,
      });
      setImagePreview(blog.image_url);
    }
  }, [blog]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog(formState).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update blog:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBlog(id).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL or base64 string
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Preview the image
        setFormState((prevState) => ({
          ...prevState,
          image: reader.result, // Store base64 string in form state
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <h2>Loading blog...</h2>;
  }

  if (error) {
    return <h2>Error fetching blog: {error.message}</h2>;
  }

  return (
    <div className="blog-detail">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="add-blog-form">
          <h2>Edit Blog</h2>

          {isUpdateLoading && <p>Updating blog...</p>}

          {/* Image Preview */}
          <div style={{ marginBottom: "10px" }}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <p>No image selected</p>
            )}
          </div>

          {/* Image Input */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Other Inputs */}
          <input
            type="text"
            name="title"
            value={formState.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <input
            type="text"
            name="author"
            value={formState.author}
            onChange={handleChange}
            placeholder="Author"
            required
          />
          <textarea
            name="content"
            value={formState.content}
            onChange={handleChange}
            placeholder="Content"
            rows="5"
            required
          ></textarea>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <img
              src={blog.image_url}
              alt={blog.title}
              style={{
                maxWidth: "300px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <div style={{ marginLeft: "20px" }}>
              <h1>{blog.title}</h1>
              <p>By {blog.author}</p>
              <p>{blog.content}</p>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button
                onClick={handleDelete}
                disabled={isDeleteLoading}
                style={{ marginLeft: "10px", background: "#d9534f" }}
              >
                {isDeleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogDetailPage;
