"use client";

import { useEffect, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChatRequestBody, StreamMessageType } from "@/lib/types";
import WelcomeMessage from "./WelcomeMessage";
import { createSSEParser } from "@/lib/createSSEParser";
import { MessageBubble } from "@/components/MessageBubble";
import { ArrowRight } from "lucide-react";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: Doc<"messages">[];
}

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Doc<"messages">[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [currentTool, setCurrentTool] = useState<{
    name: string;
    input: unknown;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 100);
  };

  useEffect(() => {
    console.log("SCROLL TRIGERRED");
    scrollToBottom();
  }, [messages, streamedResponse]);

  const formatToolOutput = (output: unknown): string => {
    if (typeof output === "string") return output;
    return JSON.stringify(output, null, 2);
  };

  const formatTerminalOutput = (
    tool: string,
    input: unknown,
    output: unknown
  ) => {
    const terminalHtml = `<div class="bg-[#1e1e1e] text-white font-mono p-2 rounded-md my-2 overflow-x-auto whitespace-normal max-w-[600px]">
      <div class="flex items-center gap-1.5 border-b border-gray-700 pb-1">
        <span class="text-red-500">●</span>
        <span class="text-yellow-500">●</span>
        <span class="text-green-500">●</span>
        <span class="text-gray-400 ml-1 text-sm">~/${tool}</span>
      </div>
      <div class="text-gray-400 mt-1">$ Input</div>
      <pre class="text-yellow-400 mt-0.5 whitespace-pre-wrap overflow-x-auto">${formatToolOutput(input)}</pre>
      <div class="text-gray-400 mt-2">$ Output</div>
      <pre class="text-green-400 mt-0.5 whitespace-pre-wrap overflow-x-auto">${formatToolOutput(output)}</pre>
    </div>`;

    return `---START---\n${terminalHtml}\n---END---`;
  };

  const processStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: (chunk: string) => Promise<void>
  ) => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await onChunk(new TextDecoder().decode(value));
        scrollToBottom();
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    setInput("");
    setStreamedResponse("");
    setCurrentTool(null);
    setIsLoading(true);

    const optimisticUserMessage: Doc<"messages"> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, optimisticUserMessage]);

    let fullResponse = "";

    try {
      const requestBody: ChatRequestBody = {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        newMessage: trimmedInput,
        chatId,
      };

      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      if (!response.body) {
        throw new Error("No response body available");
      }

      const parser = createSSEParser();
      const reader = response.body.getReader();

      await processStream(reader, async (chunk) => {
        const messages = parser.parse(chunk);

        for (const message of messages) {
          switch (message.type) {
            case StreamMessageType.Token:
              if ("token" in message) {
                fullResponse += message.token;
                setStreamedResponse(fullResponse);
              }
              break;

            case StreamMessageType.ToolStart:
              if ("tool" in message) {
                setCurrentTool({
                  name: message.tool,
                  input: message.input,
                });
                fullResponse += formatTerminalOutput(
                  message.tool,
                  message.input,
                  "Processing..."
                );
                setStreamedResponse(fullResponse);
              }
              break;

            case StreamMessageType.ToolEnd:
              if ("tool" in message && currentTool) {
                const lastTerminalIndex = fullResponse.lastIndexOf(
                  '<div class="bg-[#1e1e1e]'
                );
                if (lastTerminalIndex !== -1) {
                  fullResponse =
                    fullResponse.substring(0, lastTerminalIndex) +
                    formatTerminalOutput(
                      message.tool,
                      currentTool.input,
                      message.output
                    );
                  setStreamedResponse(fullResponse);
                }
                setCurrentTool(null);
              }
              break;

            case StreamMessageType.Error:
              if ("error" in message) {
                throw new Error(message.error);
              }
              break;

            case StreamMessageType.Done:
              const assistantMessage: Doc<"messages"> = {
                _id: `temp_assistant_${Date.now()}`,
                chatId,
                content: fullResponse,
                role: "assistant",
                createdAt: Date.now(),
              } as Doc<"messages">;

              const convex = getConvexClient();
              await convex.mutation(api.messages.store, {
                chatId,
                content: fullResponse,
                role: "assistant",
              });

              setMessages((prev) => [...prev, assistantMessage]);
              setStreamedResponse("");
              return;
          }
        }
      });
    } catch (error) {
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticUserMessage._id)
      );
      setStreamedResponse(
        formatTerminalOutput(
          "error",
          "Failed to process message",
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-[calc(100vh-theme(spacing.14))] bg-gradient-to-b from-gray-50 to-white">
      <section className="flex-1 overflow-y-auto p-2 md:p-0 scroll-smooth">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* <AnimatePresence mode="popLayout"> */}
          {messages?.length === 0 && (
            <motion.div
              key="welcome-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onAnimationComplete={scrollToBottom}
            >
              <WelcomeMessage />
            </motion.div>
          )}

          {messages?.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onAnimationComplete={scrollToBottom}
            >
              <MessageBubble
                content={message.content}
                isUser={message.role === "user"}
              />
            </motion.div>
          ))}

          {streamedResponse && (
            <motion.div
              key="streamed-response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onAnimationComplete={scrollToBottom}
            >
              <MessageBubble content={streamedResponse} />
            </motion.div>
          )}

          {isLoading && !streamedResponse && (
            <motion.div
              key="loading-indicator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
              onAnimationComplete={scrollToBottom}
            >
              <div className="rounded-2xl px-4 py-3 bg-white text-gray-900 rounded-bl-none shadow-sm ring-1 ring-inset ring-gray-100">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`loading-dot-${i}`}
                      className="h-2 w-2 rounded-full bg-indigo-400"
                      animate={{
                        y: ["0%", "-50%", "0%"],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-1" />
          {/* </AnimatePresence> */}
        </div>
      </section>

      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t border-purple-100/20 bg-white/80 backdrop-blur-lg p-4 sticky bottom-0"
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Agent..."
              className="flex-1 py-3 px-4 rounded-2xl border border-purple-100/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 bg-white/50 backdrop-blur placeholder:text-gray-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-1.5 rounded-xl h-9 w-9 p-0 flex items-center justify-center transition-all ${
                input.trim()
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <ArrowRight
                className={input.trim() ? "animate-in slide-in-right" : ""}
              />
            </Button>
          </div>
        </form>
      </motion.footer>
    </main>
  );
}
