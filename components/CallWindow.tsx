"use client";
import React from "react";
import { useSocket } from "@/context/SocketContext";
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff } from "react-icons/md";

const CallWindow = () => {
  const { inCall, leaveCall, incomingCall } = useSocket();

  if (!inCall) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#111b21] flex flex-col items-center justify-center">
      {/* Remote Video */}
      <div id="remote-player" className="absolute inset-0 w-full h-full bg-black">
        {/* If no video, show caller info */}
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 rounded-full bg-[#f0f2f5] mb-4 flex items-center justify-center text-4xl font-bold text-[#111b21]">
                {incomingCall?.fromUser?.name?.[0] || "W"}
            </div>
            <p className="text-white text-xl font-medium">{incomingCall?.fromUser?.name || "WhatsApp User"}</p>
        </div>
      </div>

      {/* Local Video (Small Overlay) */}
      <div 
        id="local-player" 
        className="absolute top-6 right-6 w-48 h-64 bg-[#202c33] rounded-xl overflow-hidden border-2 border-[#00a884] shadow-2xl z-10"
      >
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 flex gap-6 z-20">
        <button className="w-14 h-14 bg-[#202c33] text-white rounded-full flex items-center justify-center hover:bg-[#2a3942] transition-all border border-[#2a3942]">
          <MdMic size={28} />
        </button>
        <button 
          onClick={() => leaveCall()}
          className="w-16 h-16 bg-[#ea0038] text-white rounded-full flex items-center justify-center hover:bg-[#d00032] transition-all shadow-xl"
        >
          <MdCallEnd size={36} />
        </button>
        <button className="w-14 h-14 bg-[#202c33] text-white rounded-full flex items-center justify-center hover:bg-[#2a3942] transition-all border border-[#2a3942]">
          <MdVideocam size={28} />
        </button>
      </div>
    </div>
  );
};

export default CallWindow;
