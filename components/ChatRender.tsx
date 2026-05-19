'use client';

import { formatTime } from "@/service/helper";
import React from "react";
import { BsCheck, BsCheckAll, BsClock } from "react-icons/bs";

const MessageStatus = ({ status }: { status?: "pending" | "sent" | "delivered" | "read" }) => {
  switch (status) {
    case "pending":
      return <BsClock className="text-[9px] text-[#8696a0]" />;
    case "sent":
      return <BsCheck className="text-[16px] text-[#8696a0]" />;
    case "delivered":
      return <BsCheckAll className="text-[16px] text-[#8696a0]" />;
    case "read":
      return <BsCheckAll className="text-[16px] text-[#34B7F1]" />;
    default:
      return <BsClock className="text-[9px] text-[#8696a0]" />;
  }
};

const ChatRender = ({ allMessages, id }: { allMessages: any[], id: string | null }) => {

  return (
    <>
      {allMessages?.map((item, index) => (
        <div key={index}>
          {item?.senderId === id ? (
            <div className="flex justify-start w-full">
              <div className="relative bg-[#FFFFFF] w-fit max-w-[600px] text-wrap pr-12 pl-4 pt-[6px] pb-[15px] ml-5 mt-5 rounded-[5px]">
                <span>{item?.message}</span>
                <span className="absolute bottom-0 right-0 px-[5px] text-[12px] text-neutral-400">
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
                <span className="absolute bottom-0 right-0 px-[5px] text-[12px] flex items-center gap-0.5 text-neutral-500">
                  <span>{formatTime(item?.createdAt)}</span>
                  <MessageStatus status={item?.status} />
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
