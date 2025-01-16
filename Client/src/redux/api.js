import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api.php/' }), // Update the base URL as needed
    tagTypes: ['Blogs'],
    endpoints: (builder) => ({
        getAllBlogs: builder.query({
            query: () => 'blogs', // Endpoint for fetching all blogs
            providesTags: ['Blogs'],
        }),
        getBlog: builder.query({
            query: (id) => `blogs/${id}`, // Endpoint for fetching a single blog by ID
            providesTags: (result, error, id) => [{ type: 'Blogs', id }],
        }),
        createBlog: builder.mutation({
            query: (newBlog) => ({
                url: 'blogs',
                method: 'POST',
                body: newBlog,
            }),
            
            invalidatesTags: ['Blogs'], // Invalidates the 'Blogs' tag to refetch the list
        }),
        updateBlog: builder.mutation({
            query: (blog) => ({
                url: `blogs/${blog.id}`,
                method: 'PUT',
                body: blog,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Blogs', id }],
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `blogs/${id}`,
                method: 'DELETE',
            }),
           
        }),
    }),
});

export const {
    useGetAllBlogsQuery,
    useGetBlogQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
} = api;
