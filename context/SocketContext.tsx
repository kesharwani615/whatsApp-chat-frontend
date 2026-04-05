"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string, type?: string) => void;
  sendMessageSingle: (roomId: string, usermessage: string) => void;
  receiveMessage: (callback: (data: any) => void) => (() => void) | void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  joinRoom: () => {},
  sendMessageSingle: () => {},
  receiveMessage: () => {},
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
        console.error("Socket connection error:", err.message);
      });

      setSocket(socketInstance);
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
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

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinRoom, sendMessageSingle, receiveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
