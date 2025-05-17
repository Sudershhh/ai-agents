"use client";

import { useState } from "react";
import {
  Youtube,
  BookOpen,
  Search,
  MessageSquareCode,
  ArrowUp,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { WaveAnimation } from "@/components/wave-animation"

const features = [
  {
    icon: Youtube,
    title: "YouTube Analysis",
    description: "Extract and analyze video transcripts",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
  },
  {
    icon: BookOpen,
    title: "Google Books",
    description: "Search through millions of books",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    icon: Search,
    title: "Wikipedia Search",
    description: "Access vast knowledge instantly",
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
  },

  {
    icon: MessageSquareCode,
    title: "JSONata Processing",
    description: "Advanced data transformation",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-100",
  },
];

export default function DashboardPage() {
  const [inputValue, setInputValue] = useState("");
  const { user } = useUser();
  const router = useRouter();
  const createChat = useMutation(api.chats.createChat);
  const firstName = user?.firstName || "there";

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    try {
      const chatId = await createChat({ title: inputValue.slice(0, 30) });
      // Store the initial query in sessionStorage
      sessionStorage.setItem(`initialQuery_${chatId}`, inputValue.trim());
      router.push(`/dashboard/chat/${chatId}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen h-screen px-4 py-8">
      {/* Siri-like Animation */}
      {/* <div className="mb-6"><WaveAnimation /></div> */}

      {/* Greeting */}
      <h1 className="text-6xl font-medium text-gray-900 mb-3">
        Hello, {firstName}
      </h1>
      <p className="text-5xl mb-8">
        What&apos;s on{" "}
        <span className="text-purple-500 animate-shimmer bg-[linear-gradient(110deg,#7c3aed,45%,#a855f7,55%,#7c3aed)] bg-[length:200%_100%] inline-block text-transparent bg-clip-text">
          your mind?
        </span>
      </p>

      {/* Input Box */}
      <div className="w-full max-w-2xl mb-10 mt-4">
        <div className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 text-lg resize-none overflow-y-auto min-h-[2.5rem] max-h-[12rem]"
              placeholder="Ask AI Agent..."
              rows={1}
              style={{
                height: "auto",
                minHeight: "2.5rem",
                maxHeight: "12rem",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 192)}px`; // 192px = 12rem
              }}
            />
          </div>
          <div className="px-4 pb-4 flex justify-end">
            <button
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={handleSubmit}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-4xl mt-4">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">
          Our Agent Capabilities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${feature.bgColor} ${feature.borderColor} border cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col h-full">
                <div className={`${feature.color} mb-3`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
