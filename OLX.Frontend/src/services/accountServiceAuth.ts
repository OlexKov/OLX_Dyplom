import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQueryWithAuth } from "../utilities/baseQuery"
import { logOut } from '../store/slices/userSlice';

export const accountApiAuth = createApi({
    reducerPath: 'accountApiAuth',
    baseQuery: createBaseQueryWithAuth('Account'),
    tagTypes: ['Account'],

    endpoints: (builder) => ({

        logout: builder.mutation({
            query: () => {
                return {
                    url: 'user/logout',
                    method: 'POST',
                    credentials: "include"
                }
            },
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(logOut());
                    await queryFulfilled;
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
})

export const { useLogoutMutation } = accountApiAuth