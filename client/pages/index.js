import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Blobs from "@/components/Blobs";
const ChatComponent = dynamic(() => import("@/components/Chat"),{ssr:false});
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Blobs/>
      {/* <ChatComponent />; */}
    </>
  );
}
