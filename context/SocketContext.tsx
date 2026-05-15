"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { MdCallEnd } from "react-icons/md";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, type?: string) => void;
  sendMessageSingle: (roomId: string, usermessage: string) => void;
  receiveMessage: (callback: (data: any) => void) => (() => void) | void;
  startCall: (receiverId: string) => void;
  incomingCall: any;
  setIncomingCall: React.Dispatch<React.SetStateAction<any>>;
  acceptCall: (roomId: string) => void;
  rejectCall: (roomId: string) => void;
  endCall: (roomId: string) => void;
  inCall: boolean;
  leaveCall: () => void;
}


const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => { },
  sendMessageSingle: () => { },
  receiveMessage: () => { },
  startCall: () => { },
  incomingCall: null,
  setIncomingCall: () => { },
  acceptCall: () => { },
  rejectCall: () => { },
  endCall: () => { },
  inCall: false,
  leaveCall: () => { }
});


export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({
  children,
  initialToken
}: {
  children: React.ReactNode,
  initialToken?: string
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [inCall, setInCall] = useState(false);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<IRemoteVideoTrack | null>(null);
  const [remoteUser, setRemoteUser] = useState<IAgoraRTCRemoteUser | null>(null);
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const clientRef = React.useRef<IAgoraRTCClient | null>(null);

  const getClient = async () => {
    if (clientRef.current) return clientRef.current;
    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = agoraClient;
    setClient(agoraClient);
    return agoraClient;
  };

  useEffect(() => {
    getClient();
  }, []);

  const joinAgora = async (channelName: string, token: string) => {
    const activeClient = await getClient();
    try {
      console.log("Joining Agora with channel:", channelName, "and token:", token);
      const uid = await activeClient.join(APP_ID!, channelName, token, 0);
      console.log("uid", uid)
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      await activeClient.publish([audioTrack, videoTrack]);

      setInCall(true);

      activeClient.on("user-published", async (user, mediaType) => {
        await activeClient.subscribe(user, mediaType);

        if (mediaType === "video") {
          setRemoteUser(user);
          setRemoteVideoTrack(user.videoTrack || null);
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      activeClient.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          setRemoteVideoTrack(null);
        }
      });
    } catch (error) {
      console.error("Agora join failed", error);
    }
  };

  const leaveCall = async () => {
    const activeClient = clientRef.current;
    if (!activeClient) return;
    localAudioTrack?.close();
    localVideoTrack?.close();
    await activeClient.leave();
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    setRemoteVideoTrack(null);
    setRemoteUser(null);
    setInCall(false);
  };


  const handleIncomingCall = (data: any) => {
    setIncomingCall(data);
  };

  useEffect(() => {
    const initializeSocket = async () => {
      // Use the token passed from the server-side layout
      const token = initialToken;

      console.log("Socket initializing with token:", token);

      // Initialize socket connection
      const socketInstance = io("http://localhost:4700", {
        // Option 1: Match your server's query check
        query: {
          authorization: token || "",
        },
        // Option 2: Also add it to auth just in case you update the server later
        auth: {
          token: token || "",
        },
        transports: ["websocket"],
      });


      socketInstance.on("connect", () => {
        console.log("Socket connected:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socketInstance.on("connect_error", (err) => {
        console.log("Socket connection error:", err.message);
      });

      socketInstance.on("incomingCall", (data) => {
        console.log("Incoming call received in context:", data);
        handleIncomingCall(data);
      });

      socketInstance.on("callAccepted", async (data) => {
        const { channelName, receiverId } = data;

        const tokenRes = await fetch(`http://localhost:4700/api/v1/agora/token?receiverId=${receiverId}&channelName=${channelName}`, {
          headers: {
            Authorization: `Bearer ${initialToken}`,
          },
        });

        const token = await tokenRes.json();

        console.log("token", token);
        await joinAgora(channelName, token.token);
      });

      socketInstance.on("callEnded", async () => {
        console.log("Call ended by other user");
        await leaveCall();
      });



      setSocket(socketInstance);
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("incomingCall");
        socket.disconnect();
      }
    };
  }, [initialToken]);

  const joinRoom = (roomId: string, type: string = "single") => {
    if (socket) {
      socket.emit("joinRoom", { roomId, type });
    }
  };

  const sendMessageSingle = (roomId: string, usermessage: string) => {
    if (socket) {
      console.log("sendMessageSingle", { roomId, usermessage })
      socket.emit("sendMessageSingle", { roomId, usermessage });
    }
  };

  const receiveMessage = (callback: (data: any) => void) => {
    if (socket) {
      const listener = (data: any) => {
        console.log("receiveMessage event received:", data);
        callback(data);
      };

      socket.on("receiveMessage", listener);

      // Return cleanup function to remove this specific listener
      return () => {
        socket.off("receiveMessage", listener);
      };
    }
  };

  const startCall = (receiverId: string) => {
    if (socket) {
      console.log("startCall", receiverId);
      socket.emit("callUser", { toUserId: receiverId });
    }
  };

  const acceptCall = (callId: string) => {
    if (socket) {
      console.log("acceptCall", callId);
      socket.emit("acceptCall", { callId });
    }
  };

  const rejectCall = (callId: string) => {
    if (socket) {
      console.log("rejectCall", callId);
      socket.emit("rejectCall", { callId });
    }
  };

  const endCall = async (callId: string) => {
    if (socket) {
      console.log("endCall", callId);
      socket.emit("endCall", { callId });
      await leaveCall();
    }
  };


  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      joinRoom,
      sendMessageSingle,
      receiveMessage,
      startCall,
      incomingCall,
      setIncomingCall,
      acceptCall,
      rejectCall,
      endCall,
      inCall,
      leaveCall
    }}>

      {children}

      {inCall && (
        <VideoCallOverlay
          localVideoTrack={localVideoTrack}
          remoteVideoTrack={remoteVideoTrack}
          remoteUser={remoteUser}
          onEndCall={() => incomingCall ? endCall(incomingCall.callId) : leaveCall()}
        />
      )}
    </SocketContext.Provider>

  );
};

const VideoPlayer = ({ track }: { track: ICameraVideoTrack | IRemoteVideoTrack | null }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !track) return;
    track.play(containerRef.current);
    return () => {
      track.stop();
    };
  }, [track]);

  return <div ref={containerRef} className="w-full h-full" />;
};

const VideoCallOverlay = ({ localVideoTrack, remoteVideoTrack, remoteUser, onEndCall }: any) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8">
      <div className="relative w-full max-w-6xl aspect-video bg-neutral-900 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/5 group">

        {/* Remote Player (Main) */}
        <div className="w-full h-full bg-neutral-800">
          {remoteVideoTrack ? (
            <VideoPlayer track={remoteVideoTrack} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-neutral-700 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-white/20 text-4xl">?</span>
              </div>
              <p className="text-white/40 font-medium tracking-wide">Waiting for remote user...</p>
            </div>
          )}
        </div>

        {/* Local Player (Floating) */}
        <div className="absolute top-6 right-6 w-1/4 min-w-[120px] max-w-[240px] aspect-video bg-neutral-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 transition-transform duration-500 hover:scale-105">
          {localVideoTrack && <VideoPlayer track={localVideoTrack} />}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 px-8 py-4 rounded-full bg-neutral-900/60 backdrop-blur-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={onEndCall}
            className="p-5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
            title="End Call"
          >
            <MdCallEnd size={32} />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Live Call</span>
        </div>
      </div>
    </div>
  );
};
