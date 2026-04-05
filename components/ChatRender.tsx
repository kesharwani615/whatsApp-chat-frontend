'use client';

import { useGetUserChatQuery } from "@/redux RTK/api/users";
import { useAppSelector } from "@/redux RTK/hooks";
import { getUserChat } from "@/service/apiMethods";
import { formatTime } from "@/service/helper";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

const ChatRender = ({allMessages,id}: {allMessages: any[],id:string | null}) => {  

  return (
    <>
      {allMessages?.map((item, index) => (
        <div key={index}>
          {item?.senderId === id ? (
          <div className="flex justify-start w-full">
            <div className="relative bg-[#FFFFFF] w-fit max-w-[600px] text-wrap pr-12 pl-4 pt-[6px] pb-[15px] ml-5 mt-5 rounded-[5px]">
              <span>{item?.message}</span>
              <span className="absolute bottom-0 right-0 px-[5px] text-[12px]">
                {formatTime(item?.createdAt)}
              </span>
            </div>
          </div>
          ) : (
          <div className="flex justify-end w-full">
            <div className="relative bg-[#D9FDD3] w-fit max-w-[600px] text-wrap pr-12 pl-4 pt-[6px] pb-[15px] mr-5 mt-5 rounded-[5px]">
              <span>
                {item?.message}
              </span>
              <span className="absolute bottom-0 right-0 px-[5px] text-[12px]">
                {formatTime(item?.createdAt)}
              </span>
            </div>
          </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ChatRender;
