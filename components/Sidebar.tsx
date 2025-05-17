"use client";

import { useRouter } from "next/navigation";
import { NavigationContext } from "@/lib/NavigationProvider";
import { use } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatRow from "./ChatRow";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { Columns2, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

function Sidebar() {
  const { user } = useUser();
  const router = useRouter();
  const { closeMobileNav, isMobileNavOpen } = use(NavigationContext);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/dashboard") {
      setCollapsed(true);
    }
  }, []);

  const chats = useQuery(api.chats.listChats);

  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleNewChat = async () => {
    const chatId = await createChat({ title: "New Chat" });
    router.push(`/dashboard/chat/${chatId}`);
    closeMobileNav();
  };

  const handleDeleteChat = async (id: Id<"chats">) => {
    await deleteChat({ id });
    if (window.location.pathname.includes(id)) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeMobileNav}
        ></div>
      )}

      <div
        className={cn(
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 flex flex-col justify-between bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-72"
        )}
      >
        <div>
          <div className="p-2 flex items-center justify-center">
            <motion.button
              onClick={() => setCollapsed((prev) => !prev)}
              className="rounded-full p-2 hover:bg-gray-200 transition cursor-pointer relative"
              whileHover="hover"
            >
              <motion.div
                initial={{ opacity: 1 }}
                variants={{
                  hover: { opacity: 0 },
                }}
                transition={{ duration: 0.2 }}
              >
                <Columns2 className="h-4 w-4 text-indigo-600 transition-colors" />
              </motion.div>

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                variants={{
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.2 }}
              >
                {collapsed ? (
                  <ArrowRight className="h-4 w-4 text-purple-500 transition-colors" />
                ) : (
                  <ArrowLeft className="h-4 w-4 text-purple-500 transition-colors" />
                )}
              </motion.div>
            </motion.button>
            <h1 className="text-purple-500 text-l font-semibold">
              {collapsed ? "" : "AI Agent"}
            </h1>
          </div>

          <div className="p-4 border-b border-gray-200/50">
            <Button
              className={cn(
                " cursor-pointer text-white bg-purple-400 hover:bg-purple-500  shadow-sm hover:shadow transition-all duration-200",
                collapsed ? "w-8 h-8 p-0" : "w-full"
              )}
              onClick={handleNewChat}
            >
              <PlusIcon
                className={cn(
                  "transition-all",
                  collapsed ? "w-6 h-6 font-bold" : "w-6 h-6  font-bold mr-2"
                )}
              />
              {!collapsed && "New Chat"}
            </Button>
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-y-auto space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {chats?.map((chat) => (
                <ChatRow
                  key={chat._id}
                  chat={chat}
                  onDelete={handleDeleteChat}
                  collapsed={collapsed}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-4 flex justify-center border-t-2 border-gray-300/50">
          <UserButton />
          {!collapsed && (
            <p className="text-lg ml-4 text-gray-500">{user?.fullName}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
