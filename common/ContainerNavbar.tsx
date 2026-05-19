"use client";
import Image from "next/image";
import React from "react";
import profile from "@/images/profile.svg";
import { useAppSelector } from "@/redux RTK/hooks";
import call from "@/images/icon/call.svg";
import videoCall from "@/images/icon/videoCall.svg";
import threeDot from "@/images/icon/threeDot.svg";
import search from "@/images/icon/search.svg";
import { useSocket } from "@/context/SocketContext";

const ContainerNavbar = () => {
  const selectedUser = useAppSelector((state) => state.idSlice.selectedUser);

  const { startCall, onlineUsers, typingUsers } = useSocket();
  const isOnline = selectedUser ? onlineUsers?.includes(selectedUser._id) : false;
  const isTyping = selectedUser ? typingUsers?.includes(selectedUser._id) : false;

  const onCallClick = (receiverId: string) => {
    if (!selectedUser?._id) {
      return;
    }
    startCall(receiverId);
  };

  return (
    <>
      <div className="h-[70px]  bg-[#F0F2F5] mx-auto select-none">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image src={profile} alt="profile" className="rounded-full w-10 h-10 object-cover" />
                {selectedUser && isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#F0F2F5] rounded-full animate-pulse shadow-[0_0_6px_#10b981]" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-semibold text-neutral-800 leading-tight">
                  {selectedUser ? selectedUser.name : "Select a Chat"}
                </span>
                {selectedUser && (
                  <span className={`text-[12px] font-medium leading-none mt-1 transition-colors duration-200 ${isTyping ? "text-emerald-600 italic font-semibold animate-pulse" : isOnline ? "text-emerald-600" : "text-neutral-500"}`}>
                    {isTyping ? "typing..." : isOnline ? "online" : "offline"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-8">
            <p>
              <Image src={call} alt="call" />
            </p>
            <p>
              <Image src={videoCall} alt="videocall" onClick={() => onCallClick(selectedUser?._id || "")} />
            </p>
            <p>
              <Image src={search} alt="search" />
            </p>
            <p>
              <Image src={threeDot} alt="threeDot" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerNavbar;
