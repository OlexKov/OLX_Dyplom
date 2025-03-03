
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "./baseQuery";
import { IChat, IChatCreationModel, IChatMessage, IChatMessageSendModel } from "../../models/chat";

export const chatAuthApi = createApi({
    reducerPath: 'chatAuthApi',
    baseQuery: createBaseQueryWithAuth('Chat'),
    tagTypes: ['Chats', 'ChatMessages'],
    endpoints: (builder) => ({

        getChats: builder.query<IChat[], number | undefined>({
            query: (advertId) => {
                return {
                    url: `chats?advertId=${advertId}`,
                    method: 'GET',
                }
            },
            providesTags: ["Chats"]
        }),

        getChatMessages: builder.query<IChatMessage[], number>({
            query: (chatId) => {
                return {
                    url: `messages/${chatId}`,
                    method: 'GET',
                }
            },
            providesTags: (_result, _error, chatId) => [{ type: "ChatMessages", id: chatId }],
        }),

        sendChatMessage: builder.mutation<void, IChatMessageSendModel>({
            query: (messageSendModel) => {
                return {
                    url: `send`,
                    method: 'POST',
                    // timeout: 10000,
                    body: messageSendModel
                }
            },
            invalidatesTags: (_result, _error, messageSendModel) => [{ type: "ChatMessages", id: messageSendModel.chatId }]
        }),

        createChat: builder.mutation<void, IChatCreationModel>({
            query: (chatCreationModel) => {
                return {
                    url: `create`,
                    method: 'PUT',
                    body: chatCreationModel
                }
            },
            invalidatesTags: ['Chats']
        }),

        removeChat: builder.mutation<void, number>({
            query: (chatId) => {
                return {
                    url: `user/delete/${chatId}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['Chats']
        }),

        removeMessageFromUser: builder.mutation<void, number>({
            query: (chatId) => {
                return {
                    url: `user/delete/${chatId}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['ChatMessages']
        }),

        removeMessagesFromUser: builder.mutation<void, number[]>({
            query: (chatIds) => {
                return {
                    url: `user/delete`,
                    method: 'DELETE',
                    body:chatIds
                }
            },
            invalidatesTags: ['ChatMessages']
        }),

    })
})

export const {
    useGetChatsQuery,
    useGetChatMessagesQuery,
    useSendChatMessageMutation,
    useCreateChatMutation,
    useRemoveMessageFromUserMutation,
    useRemoveMessagesFromUserMutation,
    useRemoveChatMutation,
} = chatAuthApi