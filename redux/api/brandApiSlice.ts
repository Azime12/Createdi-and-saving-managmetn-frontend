import { apiSlice } from "./apiSlice";

export const brandApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createColorBrand: builder.mutation({
      query: (colorData) => ({
        url: "/brand/colors",
        method: "POST",
        body: colorData,
      }),
      invalidatesTags: ["BrandColor"],
    }),
    getBrandColors: builder.query({
      query: () => "/brand/colors",
      providesTags: ["BrandColor"],
    }),
    updateBrandColors: builder.mutation({
      query: (colorData) => ({
        url: "/brand/colors",
        method: "PUT",
        body: colorData,
      }),
      invalidatesTags: ["BrandColor"],
    }),
    deleteBrandColors: builder.mutation({
      query: () => ({
        url: "/brand/colors",
        method: "DELETE",
      }),
      invalidatesTags: ["BrandColor"],
    }),
    getBrandColorById: builder.query({
      query: (id) => `/brand/colors/${id}`,
      providesTags: (result, error, id) => [{ type: "BrandColor", id }],
    }),
  }),
});

export const { 
  useCreateColorBrandMutation,
  useGetBrandColorsQuery,
  useUpdateBrandColorsMutation,
  useDeleteBrandColorsMutation,
  useGetBrandColorByIdQuery,
} = brandApiSlice;