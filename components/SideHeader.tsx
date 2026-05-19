"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";
import { useLogoutMutation } from "@/redux RTK/api/auth";
import { getUserIdFromToken } from "@/service/helper";

import profile from "@/images/profile.svg";
import contact from "@/images/icon/contactPeople.svg";
import status from "@/images/icon/Status Icon.svg";
import message from "@/images/icon/message.svg";
import threeDot from "@/images/icon/threeDot.svg";

const SideHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [logoutApi, { isLoading }] = useLogoutMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("whatsApp");
      console.log("token:", token);
      if (token) {
        const userId = getUserIdFromToken(token);
        console.log("userId:", userId);
        if (userId) {
          try {
            await logoutApi(userId).unwrap();
          } catch (apiError) {
            console.error("API logout failed:", apiError);
          }
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Robustly delete localStorage and cookie client-side
      localStorage.removeItem("whatsApp");
      deleteCookie("whatsApp");
      deleteCookie("whatsApp", { path: "/" });
      document.cookie = "whatsApp=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      toast.success("Logged out successfully!");
      // Use window.location.href to fully reset socket and Redux application state
      window.location.href = "/login";
    }
  };

  return (
    <div className="h-[90px] bg-[#F0F2F5] mx-auto w-full relative z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <div>
          <p className="cursor-pointer transition-transform duration-300 hover:scale-105">
            <Image src={profile} alt="profile" className="rounded-full w-10 h-10 object-cover" />
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <p className="cursor-pointer transition-colors duration-200 hover:bg-black/5 p-2 rounded-full" title="New Chat">
            <Image src={contact} alt="call" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
          </p>
          <p className="cursor-pointer transition-colors duration-200 hover:bg-black/5 p-2 rounded-full" title="Status">
            <Image src={status} alt="status" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
          </p>
          <p className="cursor-pointer transition-colors duration-200 hover:bg-black/5 p-2 rounded-full" title="Channels">
            <Image src={message} alt="channels" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
          </p>

          {/* Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`cursor-pointer transition-all duration-200 p-2 rounded-full hover:bg-black/5 focus:outline-none ${isOpen ? "bg-black/5" : ""
                }`}
              title="Menu"
            >
              <Image src={threeDot} alt="menu" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" />
            </button>

            {/* Premium Dropdown Menu */}
            {isOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150 origin-top-right"
                style={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                }}
              >
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLogOut className={`w-4 h-4 text-red-500 ${isLoading ? "animate-pulse" : ""}`} />
                  <span>{isLoading ? "Logging out..." : "Log out"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideHeader;
