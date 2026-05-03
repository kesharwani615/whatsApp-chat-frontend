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

  const { startCall } = useSocket();

  const onCallClick = (receiverId: string) => {
    if (!selectedUser?._id) {
      return;
    }
    startCall(receiverId);
  };

  return (
    <>
      <div className="h-[70px]  bg-[#F0F2F5] mx-auto">
        <div className="container mx-auto h-full flex items-center justify-between">
          <div>
            <p className="flex items-center gap-3">
              <Image src={profile} alt="profile" />
              <span>{selectedUser ? selectedUser.name : "Select a Chat"}</span>
            </p>
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
