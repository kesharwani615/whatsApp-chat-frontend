import Image from "next/image";
import React from "react";
import profile from "@/images/profile.svg";
import contact from "@/images/icon/contactPeople.svg";
import status from "@/images/icon/Status Icon.svg";
import message from "@/images/icon/message.svg";
import threeDot from "@/images/icon/threeDot.svg";
import threeLine from "@/images/icon/Verticle3Lines.svg";
import { cookies } from "next/headers";
import { User, userData } from "@/utils/module";
import UserRender from "./UserRender";

// utils/api.ts
export async function getUsers(token: string | undefined):Promise<userData> {
  console.log("token:",token);
  try {
    const response = await fetch(
      "http://localhost:4700/api/v1/chat/getalluser",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    console.log("response",response);

    const users: userData = await response.json(); 
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return {data:[]};
  }
}

const SideContainer = async () => {
  // const user = await getUsers(token);
  const cookieStore = await cookies();
  
  const token = cookieStore.get("whatsApp")?.value;
  
  let users:User[] | null = null;

  try {
    const response = await getUsers(token);
    console.log("response",response);
    users = response.data;
    console.log(users);
  } catch (error) {
    console.log("error:",error);
  }

  return (
    <nav className="bg-[#ffffff] ">
      {/* navbar  */}
      <div className="w-[400px] h-[100vh] flex flex-col ">
        <div className="h-[90px]  bg-[#F0F2F5] mx-auto w-full">
          <div className="container mx-auto h-full flex items-center justify-between px-4">
            <div>
              <p className="">
                <Image src={profile} alt="profile" />
              </p>
            </div>
            <div className="flex gap-3">
              <p className="cursor-pointer">
                <Image src={contact} alt="call" />
              </p>
              <p className="cursor-pointer">
                <Image src={status} alt="videocall" />
              </p>
              <p className="cursor-pointer">
                <Image src={message} alt="search" />
              </p>
              <p className="cursor-pointer">
                <Image src={threeDot} alt="threeDot" />
              </p>
            </div>
          </div>
        </div>

        {/* search */}

        <div className="flex justify-center border-b-[1px]  border-b-[#d7dfe3] gap-5 py-2">
          <input
            type="search"
            className="  text-[#6B7C85] outline-none bg-[#F0F2F5] w-[70%] h-10 px-3 rounded-[5px] "
            placeholder="search here"
          />
          <Image src={threeLine} alt="threeLines" />
        </div>

        {/* Conversation user */}
        <div className="overflow-auto ">
         <UserRender users={users ?? []} />
        </div>
      </div>
    </nav>
  );
};

export default SideContainer;
