"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

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

  const joinAgora = async (channelName: string, token: string) => {
    try {
      const uid = await client.join(APP_ID!, channelName, token, null);

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      await client.publish([audioTrack, videoTrack]);

      videoTrack.play("local-player");

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          user.videoTrack?.play("remote-player");
        }

        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      setInCall(true);
    } catch (error) {
      console.error("Agora join failed", error);
    }
  };

  const leaveCall = async () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    await client.leave();
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
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
    </SocketContext.Provider>
  );
};
