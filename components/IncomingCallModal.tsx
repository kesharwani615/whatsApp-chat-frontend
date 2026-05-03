"use client";
import React from "react";
import { useSocket } from "@/context/SocketContext";
import { MdCall, MdCallEnd } from "react-icons/md";
import Image from "next/image";
import defaultProfile from "@/images/profile.svg";

const IncomingCallModal = () => {
  const { incomingCall, setIncomingCall, acceptCall, rejectCall } = useSocket();

  if (!incomingCall) return null;


  const handleAccept = () => {
    acceptCall(incomingCall.callId);
    setIncomingCall(null);
  };

  const handleReject = () => {
    rejectCall(incomingCall.callId);
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-[400px] mx-4 rounded-[24px] shadow-2xl p-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">

        {/* Caller Avatar */}
        <div className="relative w-32 h-32 mb-8 group">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#f0f2f5]">
            <Image
              src={incomingCall.fromUser?.profilePic || defaultProfile}
              alt="caller"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Caller Info */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#111b21] mb-2 tracking-tight">
            {incomingCall.fromUser?.name || "WhatsApp User"}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[#667781] text-lg font-medium">Incoming video call...</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-14">
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleReject}
              className="w-16 h-16 bg-[#FF3B30] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 active:scale-95 group"
            >
              <MdCallEnd size={32} className="group-hover:rotate-12 transition-transform" />
            </button>
            <span className="text-sm font-semibold text-[#667781]">Decline</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleAccept}
              className="w-16 h-16 bg-[#34C759] rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-all shadow-lg hover:shadow-green-200 active:scale-95 group"
            >
              <MdCall size={32} className="group-hover:rotate-[-12deg] transition-transform" />
            </button>
            <span className="text-sm font-semibold text-[#667781]">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
