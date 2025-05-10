"use client";

import React, { useContext, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { NavigationContext } from "@/lib/NavigationProvider";
import { Button } from "./ui/button";
import { TrashIcon, MessageSquare, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TimeAgo from "react-timeago";
import { motion } from "framer-motion";

function ChatRow({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) {
  const router = useRouter();
  const { closeMobileNav } = useContext(NavigationContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const lastMessage = useQuery(api.messages.getLastMessage, {
    chatId: chat._id,
  });

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (confirmed) {
      setIsDeleting(true);
      try {
        await onDelete(chat._id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDeleting ? 0.5 : 1,
        y: 0,
        scale: isDeleting ? 0.98 : 1,
      }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: isDeleting ? 1 : 1.02 }}
      whileTap={{ scale: isDeleting ? 1 : 0.98 }}
      className={`group rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 border border-purple-100/20 transition-all duration-200 ${isDeleting ? "cursor-not-allowed" : "cursor-pointer"} shadow-sm hover:shadow-md overflow-hidden`}
      onClick={!isDeleting ? handleClick : undefined}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="rounded-full p-2 bg-gradient-to-r from-purple-100 to-indigo-100">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate font-medium group-hover:text-indigo-600 transition-colors">
                {lastMessage ? (
                  <>
                    {lastMessage.role === "user" ? (
                      <span className="text-purple-600 font-medium">You: </span>
                    ) : (
                      <span className="text-indigo-600 font-medium">AI: </span>
                    )}
                    <span className="text-gray-500">
                      {lastMessage.content.replace(/\\n/g, " ")}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">New conversation</span>
                )}
              </p>
              {lastMessage && (
                <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">
                  <TimeAgo date={lastMessage.createdAt} />
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            className={`opacity-0 group-hover:opacity-100 -mr-2 -mt-2 transition-all duration-200 hover:bg-red-50 ${
              isDeleting ? "cursor-not-allowed opacity-100" : ""
            }`}
            onClick={handleDelete}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
            )}
          </Button>
        </div>
      </div>
      {isDeleting && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/10 to-indigo-100/10">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/20 to-transparent animate-shimmer"
            style={{ transform: "translateX(-100%)" }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default ChatRow;
