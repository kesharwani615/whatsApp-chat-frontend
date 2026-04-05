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

const ChatContainer = () => {
  const [message, setMessage] = useState("");
  const { sendMessageSingle } = useSocket();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const id = useAppSelector((state) => state.idSlice.userId); 
  const { data, isLoading, isError } = useGetUserChatQuery({ id }, {
    skip: !id
  });
  const { receiveMessage } = useSocket();
  const [allMessages, setAllMessages] = useState<any[]>([]);

  // Update local state when API data changes (initial load)
  useEffect(() => {
    if (data?.data) {
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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [allMessages, isLoading]);

  const handleSendMessage = () => {
    if (message.trim() && id) {
      console.log("id, message:", id, message);
      sendMessageSingle(id, message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              <ChatRender allMessages={allMessages} id={id}/>
            </Suspense>
          )}
        </div>

        {/* Typing here for send message */}
        {
          id && (
        <div className="mt-auto bg-[#F0F2F5] py-3 flex">
          <div className="flex gap-7 w-[100px] px-4">
            <Image src={emoji} alt={"emoji"} />
            <Image src={share} alt={"share"} />
          </div>
          <textarea
            name="message"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
