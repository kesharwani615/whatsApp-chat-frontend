import ChatContainer from "@/components/ChatContainer";
import HelperComponent from "@/components/HelperComponent";
import SideContainer from "@/components/SideContainer";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

  const cookieStore = await cookies();
   
   const token = cookieStore.get("whatsApp")?.value;

   if(!token){
    redirect("/login");
   }

  return (
    <>
      <div className="flex w-full">
        <div className="flex-none">
          {/* <HelperComponent> */}
            <Suspense fallback={<div>Loading...</div>}>
              <SideContainer />
            </Suspense>
          {/* </HelperComponent> */}
        </div>
        <div className="flex-1">
          <ChatContainer />
        </div>
      </div>
    </>
  );
}