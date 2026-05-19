"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import background from "@/images/background.svg";
import ContainerNavbar from "@/common/ContainerNavbar";
import emoji from "@/images/icon/emoji.svg";
import share from "@/images/icon/sharing.svg";
import Image from "next/image";
import { IoMdSend } from "react-icons/io";
import { useAppSelector } from "@/redux RTK/hooks";
import { useGetUserChatQuery } from "@/redux RTK/api/users";
import { useSocket } from "@/context/SocketContext";
import ChatRender from "./ChatRender";
import { EMOJI_CATEGORIES } from "@/service/Constant";


const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<any>(null);

  const {
    sendMessageSingle,
    sendTypingIndicator,
    sendStopTypingIndicator,
    receiveMessage,
    typingUsers
  } = useSocket();

  const id = useAppSelector((state) => state.idSlice.userId);
  const selectedUser = useAppSelector((state) => state.idSlice.selectedUser);
  const isTyping = id ? typingUsers?.includes(id) : false;

  const { data, isLoading, isError } = useGetUserChatQuery({ id }, {
    skip: !id
  });
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [roomId, setRoomId] = useState<string | undefined>("");

  // Emoji Picker States & Refs
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [emojiSearch, setEmojiSearch] = useState("");
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Click Outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getFilteredEmojis = () => {
    if (!emojiSearch.trim()) {
      return EMOJI_CATEGORIES[activeCategory].emojis;
    }
    const searchLower = emojiSearch.toLowerCase();
    const matchedCategory = EMOJI_CATEGORIES.find(c =>
      c.name.toLowerCase().includes(searchLower)
    );
    if (matchedCategory) {
      return matchedCategory.emojis;
    }
    // Fallback search: filter all emojis by category names matching
    return EMOJI_CATEGORIES.flatMap(c => c.emojis).filter((_, idx) => idx % 6 === 0).slice(0, 40);
  };

  const handleEmojiSelect = (emojiChar: string) => {
    setMessage((prev) => prev + emojiChar);

    if (roomId) {
      sendTypingIndicator({ roomId, userName: id ?? "" });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (roomId) {
        sendStopTypingIndicator({ roomId, userName: id ?? "" });
      }
    }, 1000);

    const textarea = document.getElementsByName("message")[0];
    if (textarea) {
      (textarea as HTMLTextAreaElement).focus();
    }
  };

  // Update local state when API data changes (initial load)
  useEffect(() => {
    if (data?.data) {
      setRoomId(data?.roomId);
      setAllMessages(data.data);
    }
  }, [data?.data]);

  // Subscribe to real-time message updates
  useEffect(() => {
    const unsubscribe = receiveMessage((newMessage: any) => {
      setAllMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [receiveMessage, id]);

  // Scroll to bottom when messages or typing status changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [allMessages, isLoading, isTyping]);

  const handleSendMessage = () => {
    if (message.trim() && id) {
      console.log("id, message:", id, message);
      sendMessageSingle(id, message);
      setMessage("");

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (roomId) {
        sendStopTypingIndicator({ roomId, userName: id ?? "" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (roomId) {
      sendTypingIndicator({ roomId, userName: id ?? "" });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (roomId) {
        sendStopTypingIndicator({ roomId, userName: id ?? "" });
      }
    }, 1000);
  };

  return (
    <>
      <ContainerNavbar />
      <div
        className="w-full h-[calc(100vh-90px)] flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${background.src})` }}
      >
        <div
          className="overflow-auto h-full"
          id="chat-container"
          ref={chatContainerRef}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-[#667781]">Loading...</div>
          ) : isError ? (
            <div className="flex justify-center items-center h-full text-red-500">Error loading messages.</div>
          ) : !allMessages?.length ? (
            <div className="flex justify-center items-center h-full text-[#667781]">No messages yet.</div>
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <ChatRender allMessages={allMessages} id={id} />
            </Suspense>
          )}

          {/* Typing Indicator Bubble at the bottom of messages list */}
          {selectedUser && isTyping && (
            <div className="flex items-center gap-3 px-4 py-2.5 my-3 ml-6 bg-white/95 border border-neutral-200/50 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-w-max animate-fade-in-up">
              <div className="flex items-center gap-1.5 px-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[13px] text-neutral-500 font-medium select-none">
                {selectedUser.name} is typing...
              </span>
            </div>
          )}
        </div>

        {/* Typing here for send message */}
        {
          id && (
            <div className="mt-auto bg-[#F0F2F5] py-3 flex relative">
              {/* Premium Floating Emoji Picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-[82px] left-[20px] w-[340px] h-[310px] bg-white/95 backdrop-blur-md border border-neutral-200/60 rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.12)] flex flex-col z-50 select-none animate-fade-in"
                >
                  {/* Search Bar */}
                  <div className="p-2 border-b border-neutral-100 flex items-center">
                    <input
                      type="text"
                      placeholder="Search emojis..."
                      value={emojiSearch}
                      onChange={(e) => setEmojiSearch(e.target.value)}
                      className="w-full px-3 py-1.5 text-[13px] bg-neutral-100/70 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Categories */}
                  {!emojiSearch && (
                    <div className="flex justify-between px-3 py-1 bg-neutral-50/50 border-b border-neutral-100 overflow-x-auto scrollbar-none">
                      {EMOJI_CATEGORIES.map((cat, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCategory(idx)}
                          className={`p-1.5 rounded-lg text-[16px] cursor-pointer hover:bg-neutral-200/50 active:scale-95 transition-all duration-150 ${activeCategory === idx ? "bg-emerald-100/60 scale-105" : ""}`}
                          title={cat.name}
                        >
                          {cat.icon}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Grid */}
                  <div className="flex-1 overflow-y-auto p-3 grid grid-cols-7 gap-1.5 justify-items-center content-start scrollbar-thin">
                    {getFilteredEmojis().map((emojiChar, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleEmojiSelect(emojiChar)}
                        className="text-[20px] p-0.5 rounded-lg cursor-pointer hover:bg-neutral-100 active:scale-90 transition-all duration-100"
                      >
                        {emojiChar}
                      </button>
                    ))}
                    {getFilteredEmojis().length === 0 && (
                      <span className="col-span-7 text-[12px] text-neutral-400 text-center py-8">
                        No emojis found
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-7 w-[100px] px-4 items-center">
                <Image
                  src={emoji}
                  alt={"emoji"}
                  className="cursor-pointer hover:scale-110 active:scale-95 transition-all duration-150"
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                />
                <Image
                  src={share}
                  alt={"share"}
                  className="cursor-pointer hover:scale-110 active:scale-95 transition-all duration-150"
                />
              </div>
              <textarea
                name="message"
                placeholder="Enter your message here"
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                className="bg-[#ffffff] rounded-[10px] px-5 py-4 outline-none w-full max-w-full  
              resize-none
              min-h-[60px] max-h-[200px]  
              overflow-y-auto"
              ></textarea>
              <div className="w-[100px] h-full flex justify-center items-center">
                <IoMdSend
                  className="text-[25px] cursor-pointer"
                  onClick={handleSendMessage}
                />
              </div>
            </div>
          )
        }
      </div>
    </>
  );
};

export default ChatContainer;
