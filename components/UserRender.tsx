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
  const { joinRoom } = useSocket();

  const handleUserClick = (user: User) => {
    console.log("user clicked:", user);
    dispatch(setUserId(user._id));
    dispatch(setSelectedUser(user));
    joinRoom(user._id, "single");
  };

  return (
    <>
     {Array.isArray(users) && users?.map((res, index) => (
            <div
              key={index}
              onClick={() => handleUserClick(res)}
              className="cursor-pointer flex items-center justify-between hover:bg-[#25d366] border-b-[1px] border-b-[#d7dfe3] px-4 py-2 "
            >
              <div className="w-[90%]  flex items-center  gap-5">
                <div>
                  <Image src={profile} alt="profile" />
                </div>
                <div className="flex flex-col">
                  <span>{res.name}</span>
                  <span className="text-[#6B7C85] text-[13px]">Gideon Nic</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span>2:30</span>
                <span className="text-[13px] border text-center rounded-2xl bg-[#25D366] text-[#ffffff] py-[2px] px-2">
                  120
                </span>
              </div>
            </div>
          ))}
    </>
  )
}

export default UserRender