"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { BotIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

const formatMessage = (content: string): string => {
  content = content.replace(/\\\\/g, "\\");
  content = content.replace(/\\n/g, "\n");
  content = content.replace(/---START---\n?/g, "").replace(/\n?---END---/g, "");
  return content.trim();
};

export function MessageBubble({ content, isUser }: MessageBubbleProps) {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`rounded-2xl px-5 py-3 max-w-[85%] md:max-w-[75%] shadow-sm ring-1 ring-inset relative ${
          isUser
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none ring-purple-700/20"
            : "bg-white text-gray-900 rounded-bl-none ring-gray-100"
        }`}
      >
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: formatMessage(content) }} />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`absolute bottom-0 ${
            isUser
              ? "right-0 translate-x-1/2 translate-y-1/2"
              : "left-0 -translate-x-1/2 translate-y-1/2"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full border-2 ${
              isUser
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 border-white"
                : "bg-white border-purple-100"
            } flex items-center justify-center shadow-md`}
          >
            {isUser ? (
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-gradient-to-r from-purple-200 to-indigo-200 text-indigo-600">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <BotIcon
                className={`h-5 w-5 ${isUser ? "text-white" : "text-indigo-600"}`}
              />
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
