import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userapi = createApi({
  reducerPath: "userapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4700/api/v1/chat/",
    prepareHeaders: (headers) => {
      // You can set default headers here if needed
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', `Bearer ${localStorage.getItem("whatsApp")}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getUserChat: builder.query<any, { id: string | undefined | null }>({
      query: ({ id }) => ({
        url: `getUserChat/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetUserChatQuery } = userapi;