import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
const ChatComponent = dynamic(() => import("@/components/Chat"),{ssr:false});
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <ChatComponent />;
}
