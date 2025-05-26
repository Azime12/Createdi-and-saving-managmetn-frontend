import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { apiSlice } from './apiSlice';

export const userProfileApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true, // ✅ Allow overriding existing endpoint names
  endpoints: (builder) => ({
    getProfileById: builder.query({
      query: (userId) => `/users/profile/${userId}`,
      providesTags: [{ type: "User", id: "LIST" }],
    }),
    // Create a new user
    createUserByAdmin: builder.mutation({
      query: (newUser) => ({
        url: "/admin/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    checkProfileComplete: builder.query({
      query: (userId) => `/users/profile/isComplete/${userId}`,
    }),
    createProfile: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/users/profile/${userId}`,
        method: "POST",
        body: formData,
      }),      
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/profile/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      
      invalidatesTags: [{ type: "User", id: "LIST" }],

    }),

    
    
   
   
  
  
  }),
});

export const {
  //acountnumber
 
  useGetProfileByIdQuery,

  useLazyGetProfileByIdQuery,
  useCheckProfileCompleteQuery,
  useLazyCheckProfileCompleteQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} = userProfileApiSlice;