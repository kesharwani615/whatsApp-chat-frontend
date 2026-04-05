import ChatContainer from "@/components/ChatContainer";
import HelperComponent from "@/components/HelperComponent";
import SideContainer from "@/components/SideContainer";
import { Suspense } from "react";

export default function Home() {
  
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