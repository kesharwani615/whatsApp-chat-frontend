"use client";

import { useAppDispatch } from '@/redux RTK/hooks';
import { setUserId, setSelectedUser } from '@/redux RTK/slice/chat';
import { User } from '@/utils/module';
import Image from 'next/image';
import React from 'react';
import profile from "@/images/profile.svg";
import { useSocket } from '@/context/SocketContext';

interface UserRenderProps {
  users: User[];
}

const UserRender = ({ users }: UserRenderProps) => {

  const dispatch = useAppDispatch();
  const { joinRoom, onlineUsers, typingUsers } = useSocket();

  const handleUserClick = (user: User) => {
    console.log("user clicked:", user);
    dispatch(setUserId(user._id));
    dispatch(setSelectedUser(user));
    joinRoom(user._id, "single");
  };

  return (
    <>
     {Array.isArray(users) && users?.map((res, index) => {
            const isOnline = onlineUsers?.includes(res._id);
            const isTyping = typingUsers?.includes(res._id);
            return (
              <div
                key={index}
                onClick={() => handleUserClick(res)}
                className="cursor-pointer flex items-center justify-between hover:bg-[#25d366] hover:text-white border-b-[1px] border-b-[#d7dfe3] px-4 py-2 transition-colors duration-200"
              >
                <div className="w-[90%]  flex items-center  gap-5">
                  <div className="relative">
                    <Image src={profile} alt="profile" />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{res.name}</span>
                    <span className={`text-[13px] transition-colors duration-200 ${isTyping ? "text-emerald-600 italic font-semibold animate-pulse" : "text-[#6B7C85] group-hover:text-emerald-100"}`}>
                      {isTyping ? "typing..." : isOnline ? "Active now" : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span>2:30</span>
                  <span className="text-[13px] border text-center rounded-2xl bg-[#25D366] text-[#ffffff] py-[2px] px-2">
                    120
                  </span>
                </div>
              </div>
            );
          })}
    </>
  )
}

export default UserRender;