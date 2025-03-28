import { BackButton } from "../../../components/buttons/back_button"
import '../../../components/category_tree/style.scss'
import {
    useCreateChatMutation,
    useRemoveChatMutation,
    useSendChatMessageMutation,
} from "../../../redux/api/chatAuthApi"
import { useEffect, useRef, useState } from "react"
import ChatCard from "../../../components/chat_card"
import { IChat } from "../../../models/chat"
import { APP_ENV } from "../../../constants/env"
import { formatPrice } from "../../../utilities/common_funct"
import ChatMessageCard from "../../../components/chat_message_card"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Divider, Popconfirm, Tooltip } from "antd"
import useGetMessages from "./hooks/useGetMessages"
import useGetChats from "./hooks/useGetChats"
import PrimaryButton from "../../../components/buttons/primary_button"

const ChatPage: React.FC = () => {
    const navigate = useNavigate()
    const [searchParam] = useSearchParams()
    const [advertId, setAdvertId] = useState<number | undefined>()
    const chatMesssageContainer = useRef<HTMLDivElement | null>(null)
    const selectedMesssageRef = useRef<HTMLDivElement | null>(null)
    const [createChat, { isLoading: isChatCreating }] = useCreateChatMutation();
    const [sendMessage, { isLoading: isMesssageSending }] = useSendChatMessageMutation();
    const [deleteChat] = useRemoveChatMutation();
    const [message, setMessage] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<IChat>()
    const { messagesMap } = useGetMessages(selectedChat?.id, advertId)
    const { chats } = useGetChats(advertId)

    useEffect(() => {
        const queryAdvertId = Number(searchParam.get('id')) == 0 ? undefined : Number(searchParam.get('id'))
        setAdvertId(queryAdvertId)
    }, [])

    useEffect(() => {
        if (chatMesssageContainer.current) {
            chatMesssageContainer.current.scrollTop = chatMesssageContainer.current.scrollHeight;
        }
    }, [messagesMap])

    useEffect(() => {
        if (selectedChat && selectedMesssageRef.current) {
            selectedMesssageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }
    }, [selectedChat])

    useEffect(() => {
        if (chats.length > 0 && (!selectedChat || selectedChat.id === 0)) {
            const selected = chats.find(x => x.advert.id === advertId || x.id === 0) || undefined
            setSelectedChat(selected)
        }
    }, [advertId, chats])

    const onChatSelect = (chat: IChat) => {
        setSelectedChat(chat)
    }

    const onMessageSend = async () => {
        const str = message?.trim();
        if (str && str.length > 0 && !isChatCreating && !isMesssageSending && selectedChat) {
            if (selectedChat.id === 0 && advertId) {
                await createChat({ advertId: advertId, message: str })
            }
            else {
                await sendMessage({ chatId: selectedChat.id, message: str })
            }
            setMessage('')
        }
    }

    const onChatRemove = async () => {
        if (selectedChat && selectedChat.id !== 0) {
            const result = await deleteChat(selectedChat.id || 0)
            if (!result.error && selectedChat?.advert.id == advertId) {
                setAdvertId(undefined)
            }
        }
        else {
            setAdvertId(undefined)
        }
        setSelectedChat(undefined)
    }

    return (
        <div className="w-[84vw] gap-[5vh] mx-auto overflow-hidden flex flex-col">
            <BackButton className="text-adaptive-1_9_text mt-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            {chats.length > 0
                ? <div className="flex gap-[1.25vw] ml-[1.3vw] w-[71.2vw] h-[58vh] mb-[8vh] mt-[3vh]">
                    <div className=" border rounded-lg border-[#9B7A5B]/50 w-[33.4%] flex flex-col">
                        <h2 className="ml-[2vh] mb-[2vh] mt-[1.7vh] text-adaptive-1_9_text font-montserrat font-medium">Вхідні</h2>
                        <div className="my-[1vh] flex flex-col gap-[2.5vh] overflow-auto custom-scrollbar">
                            {chats.map((chat) =>
                                <ChatCard
                                    key={chat.id}
                                    className="h-[15vh] w-full flex-shrink-0"
                                    chat={chat}
                                    selected={selectedChat?.advert.id === chat?.advert.id}
                                    ref={selectedChat?.advert.id === chat?.advert.id ? selectedMesssageRef : undefined}
                                    onClick={onChatSelect} />)}
                        </div>
                    </div>

                    <div className=" border rounded-lg p-[1vh] overflow-hidden border-[#9B7A5B]/50 flex-1 flex justify-between flex-col gap-[1vh]">
                        {selectedChat
                            ? <>
                                <div className="flex gap-[.5vw] ">
                                    <img className="w-[8.5vh] object-contain aspect-square rounded-md " src={APP_ENV.IMAGES_100_URL + selectedChat?.advert.image} />
                                    <div className="flex w-full justify-between  overflow-hidden">
                                        <div className="flex flex-col gap-[.7vh] flex-1 overflow-hidden mr-[1vw]">
                                            <p className="text-adaptive-1_7_text font-unbounded font-medium text-nowrap overflow-hidden text-ellipsis">{selectedChat.advert.title}</p>
                                            <span className="text-adaptive-1_7_text font-medium font-montserrat ">{formatPrice(selectedChat?.advert.price || 0)} грн</span>
                                        </div>
                                        <Popconfirm
                                            title="Бажаєте видалити цей чат?"
                                            onConfirm={onChatRemove}>
                                            <Tooltip title="Видалити чат" color="gray">
                                                <svg className="h-[2.1vh] min-h-[14px] aspect-square cursor-pointer flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                                    <path d="M15 7L14.16 15.398C14.033 16.671 13.97 17.307 13.68 17.788C13.4257 18.2114 13.0516 18.55 12.605 18.761C12.098 19 11.46 19 10.18 19H7.82C6.541 19 5.902 19 5.395 18.76C4.94805 18.5491 4.57361 18.2106 4.319 17.787C4.031 17.307 3.967 16.671 3.839 15.398L3 7M10.5 13.5V8.5M7.5 13.5V8.5M1.5 4.5H6.115M6.115 4.5L6.501 1.828C6.613 1.342 7.017 1 7.481 1H10.519C10.983 1 11.386 1.342 11.499 1.828L11.885 4.5M6.115 4.5H11.885M11.885 4.5H16.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Tooltip>

                                        </Popconfirm>

                                    </div>
                                </div>
                                <hr className="my-[1.8vh]" />
                                <div ref={chatMesssageContainer} className="flex-col flex gap-[2vh] flex-1 overflow-auto custom-scrollbar  ">
                                    {Array.from(messagesMap.entries()).flatMap(([key, value]) => [
                                        <Divider key={key}>
                                            <span className="font-montserrat text-adaptive-1_4-text">{key}</span>
                                        </Divider>,
                                        ...value.map(message => (
                                            <ChatMessageCard
                                                message={message}
                                                key={message.id}
                                                clasName="px-[1vh]"
                                            />
                                        ))
                                    ])}
                                </div>
                                <div className="flex h-[3.2vh]  mx-[3.5vw] my-[.5vh] gap-[.8vw]">
                                    <svg className="w-auto h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                                        <path d="M25.5 5H21.5375L19.25 2.5H11.75L9.4625 5H5.5C4.125 5 3 6.125 3 7.5V22.5C3 23.875 4.125 25 5.5 25H25.5C26.875 25 28 23.875 28 22.5V7.5C28 6.125 26.875 5 25.5 5ZM25.5 22.5H5.5V7.5H10.5625L12.85 5H18.15L20.4375 7.5H25.5V22.5ZM15.5 8.75C12.05 8.75 9.25 11.55 9.25 15C9.25 18.45 12.05 21.25 15.5 21.25C18.95 21.25 21.75 18.45 21.75 15C21.75 11.55 18.95 8.75 15.5 8.75ZM15.5 18.75C13.4375 18.75 11.75 17.0625 11.75 15C11.75 12.9375 13.4375 11.25 15.5 11.25C17.5625 11.25 19.25 12.9375 19.25 15C19.25 17.0625 17.5625 18.75 15.5 18.75Z" fill="#3A211C" />
                                    </svg>
                                    <div className="flex bg-[#9B7A5B]/10 flex-1 items-center">
                                        <input
                                            value={message}
                                            onKeyDown={(e) => { e.key === 'Enter' && onMessageSend() }}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Написати"
                                            className="flex-1 font-montserrat text-adaptive-1_5-text rounded-b-sm pl-[.5vw] border-0 bg-transparent focus:border-0 focus:outline-none"
                                            type="text" />
                                        <div className="flex gap-[1vw] mx-[.5vw] h-[80%] flex-shrink-0">
                                            <svg className="w-auto h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="#9B7A5B" />
                                            </svg>
                                            <svg onClick={onMessageSend} className="w-auto h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.58 13.42L20 12L12 4L4 12Z" fill="black" />
                                            </svg>
                                        </div>

                                    </div>
                                </div>
                            </>
                            : <p className=" self-center my-auto font-montserrat text-adaptive-1_7_text">Оберіть чат для розмови</p>
                        }
                    </div>
                </div>
                : <div className="w-[100%] py-[6vh] px-[8vw] h-[300px] flex-col justify-start items-center inline-flex">
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]"> Активні чати з користувачами</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Список чатів вдображається тут після початку спілкування</p>
                    <PrimaryButton onButtonClick={() => { navigate(-1) }} className="w-[16.4vw] h-[4.8vh]" title="Повернутися" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)" isLoading={false} />
                </div>
            }

        </div>
    )
}

export default ChatPage