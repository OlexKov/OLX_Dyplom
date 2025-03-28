import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./baseQuery";
import { IAdvert, IAdvertCreationModel, ISetLockedRequest } from "../../models/advert";
import { advertApi } from "./advertApi";
import { getFormData } from "../../utilities/common_funct";

export const advertAuthApi = createApi({
    reducerPath: "advertAuthApi",
    baseQuery: createBaseQueryWithAuth("Advert"),
    tagTypes: ["UserAdverts", "UserAdvert"],

    endpoints: (builder) => ({
        createAdvert: builder.mutation<void, IAdvertCreationModel>({
            query: (creationModel) => ({
                url: `create`,
                method: "PUT",
                body: getFormData(creationModel),
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Locked", "NotApproved"]))
                } catch (error) {
                    console.error('Create advert failed:', error);
                }
            },
            invalidatesTags: ["UserAdvert", "UserAdverts"]
        }),

        updateAdvert: builder.mutation<void, IAdvertCreationModel>({
            query: (creationModel) => ({
                url: `update`,
                method: "POST",
                body: getFormData(creationModel),
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Locked", "NotApproved", "Advert"]))
                } catch (error) {
                    console.error('Update advert failed:', error);
                }
            },
            invalidatesTags: ["UserAdvert", "UserAdverts"]
        }),

        deleteAdvert: builder.mutation<void, number>({
            query: (id) => ({
                url: `delete/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Locked", "NotApproved", "Advert"]))
                } catch (error) {
                    console.error('Delete advert failed:', error);
                }
            },
            invalidatesTags: ["UserAdvert", "UserAdverts"]
        }),

        blockAdvert: builder.mutation<void, ISetLockedRequest>({
            query: (request) => ({
                url: `block`,
                method: "POST",
                body: request,
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Locked", "NotApproved", "Advert"]))
                } catch (error) {
                    console.error('Block advert failed:', error);
                }
            },
        }),

        approveAdvert: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `approve/${advertId}`,
                method: "POST",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "NotApproved"]))
                } catch (error) {
                    console.error('Approve advert failed:', error);
                }
            },
        }),

        getUserAdverts: builder.query<IAdvert[], void>({
            query: () => ({
                url: `get/user`,
                method: "GET",
            }),
            providesTags: ["UserAdverts"],
        }),

        getCompletedUserAdverts: builder.query<IAdvert[], void>({
            query: () => ({
                url: `get/user/completed`,
                method: "GET",
            }),
            providesTags: ["UserAdverts"],
        }),

        getLockedUserAdverts: builder.query<IAdvert[], void>({
            query: () => ({
                url: `get/user/locked`,
                method: "GET",
            }),
            providesTags: ["UserAdverts"],
        }),

        completeUserAdvert: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `complete/${advertId}`,
                method: "POST",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Advert"]))
                } catch (error) {
                    console.error('Delete completed advert failed:', error);
                }
            },
            invalidatesTags: ["UserAdverts"]
        }),

        buyUserAdvert: builder.mutation<void, number>({
            query: (advertId) => ({
                url: `buy/${advertId}`,
                method: "POST",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Advert"]))
                } catch (error) {
                    console.error('Delete completed advert failed:', error);
                }
            },
            invalidatesTags: ["UserAdverts","UserAdvert"]
        }),

        deleteCompletedUserAdverts: builder.mutation<number, void>({
            query: () => ({
                url: `delete/completed/all`,
                method: "DELETE",
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(advertApi.util.invalidateTags(["Adverts", "Locked", "NotApproved", "Advert"]))
                } catch (error) {
                    console.error('Delete completed advert failed:', error);
                }
            },
            invalidatesTags: ["UserAdvert", "UserAdverts"]
        }),

        getAdvertsByUserId: builder.query<IAdvert[], number>({
            query: (userId) => ({
                url: `get/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["UserAdvert"],
        }),
    }),
});

export const {
    useBuyUserAdvertMutation,
    useCreateAdvertMutation,
    useUpdateAdvertMutation,
    useDeleteAdvertMutation,
    useBlockAdvertMutation,
    useApproveAdvertMutation,
    useGetUserAdvertsQuery,
    useGetAdvertsByUserIdQuery,
    useGetCompletedUserAdvertsQuery,
    useDeleteCompletedUserAdvertsMutation,
    useCompleteUserAdvertMutation,
    useGetLockedUserAdvertsQuery
} = advertAuthApi;
