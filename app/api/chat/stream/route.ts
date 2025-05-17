import { submitQuestion } from "@/lib/langgraph";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { getConvexClient } from "@/lib/convex";
import {
  ChatRequestBody,
  StreamMessage,
  StreamMessageType,
  SSE_DATA_PREFIX,
  SSE_LINE_DELIMITER,
} from "@/lib/types";

// export const runtime = "edge";

function sendSSEMessage(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  data: StreamMessage
) {
  const encoder = new TextEncoder();
  return writer.write(
    encoder.encode(
      `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
    )
  );
}

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const { messages, newMessage, chatId } =
//       (await req.json()) as ChatRequestBody;
//     const convex = getConvexClient();

//     // Create stream with larger queue strategy for better performance
//     const stream = new TransformStream({}, { highWaterMark: 1024 });
//     const writer = stream.writable.getWriter();

//     const response = new Response(stream.readable, {
//       headers: {
//         "Content-Type": "text/event-stream",
//         // "Cache-Control": "no-cache, no-transform",
//         Connection: "keep-alive",
//         "X-Accel-Buffering": "no", // Disable buffering for nginx which is required for SSE to work properly
//       },
//     });

//     // Handle the streaming response
//     (async () => {
//       try {
//         // Send initial connection established message
//         await sendSSEMessage(writer, { type: StreamMessageType.Connected });

//         // Send user message to Convex
//         await convex.mutation(api.messages.send, {
//           chatId,
//           content: newMessage,
//         });

//         // Convert messages to LangChain format
//         const langChainMessages = [
//           ...messages.map((msg) =>
//             msg.role === "user"
//               ? new HumanMessage(msg.content)
//               : new AIMessage(msg.content)
//           ),
//           new HumanMessage(newMessage),
//         ];

//         try {
//           // Create the event stream
//           const eventStream = await submitQuestion(langChainMessages, chatId);

//           // Process the events
//           for await (const event of eventStream) {
//             // console.log("🔄 Event:", event);

//             if (event.event === "on_chat_model_stream") {
//               const token = event.data.chunk;
//               if (token) {
//                 // Access the text property from the AIMessageChunk
//                 const text = token.content.at(0)?.["text"];
//                 if (text) {
//                   await sendSSEMessage(writer, {
//                     type: StreamMessageType.Token,
//                     token: text,
//                   });
//                 }
//               }
//             } else if (event.event === "on_tool_start") {
//               await sendSSEMessage(writer, {
//                 type: StreamMessageType.ToolStart,
//                 tool: event.name || "unknown",
//                 input: event.data.input,
//               });
//             } else if (event.event === "on_tool_end") {
//               const toolMessage = new ToolMessage(event.data.output);

//               await sendSSEMessage(writer, {
//                 type: StreamMessageType.ToolEnd,
//                 tool: toolMessage.lc_kwargs.name || "unknown",
//                 output: event.data.output,
//               });
//             }
//           }

//           // Send completion message without storing the response
//           await sendSSEMessage(writer, { type: StreamMessageType.Done });
//         } catch (streamError) {
//           console.error("Error in event stream:", streamError);
//           await sendSSEMessage(writer, {
//             type: StreamMessageType.Error,
//             error:
//               streamError instanceof Error
//                 ? streamError.message
//                 : "Stream processing failed",
//           });
//         }
//       } catch (error) {
//         console.error("Error in stream:", error);
//         await sendSSEMessage(writer, {
//           type: StreamMessageType.Error,
//           error: error instanceof Error ? error.message : "Unknown error",
//         });
//       } finally {
//         try {
//           await writer.close();
//         } catch (closeError) {
//           console.error("Error closing writer:", closeError);
//         }
//       }
//     })();

//     return response;
//   } catch (error) {
//     console.error("Error in chat API:", error);
//     return NextResponse.json(
//       { error: "Failed to process chat request" } as const,
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: Request) {
  console.log("🚀 Starting POST request handler");
  try {
    const { userId } = await auth();
    console.log("👤 User authentication check:", { userId });

    if (!userId) {
      console.log("❌ Unauthorized access attempt");
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, newMessage, chatId } =
      (await req.json()) as ChatRequestBody;
    console.log("📨 Received request payload:", {
      chatId,
      messageCount: messages.length,
      newMessage,
    });

    const convex = getConvexClient();
    console.log("🔌 Convex client initialized");

    const stream = new TransformStream({}, { highWaterMark: 1024 });
    const writer = stream.writable.getWriter();
    console.log("📝 Stream and writer initialized");

    const response = new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
    console.log("🔧 Response headers set");

    (async () => {
      console.log("🎬 Starting async stream processing");
      try {
        await sendSSEMessage(writer, { type: StreamMessageType.Connected });
        console.log("🤝 Sent connection established message");

        await convex.mutation(api.messages.send, {
          chatId,
          content: newMessage,
        });
        console.log("💾 Saved user message to Convex:", { chatId, newMessage });

        const langChainMessages = [
          ...messages.map((msg) =>
            msg.role === "user"
              ? new HumanMessage(msg.content)
              : new AIMessage(msg.content)
          ),
          new HumanMessage(newMessage),
        ];
        console.log("🔄 Converted messages to LangChain format:", {
          messageCount: langChainMessages.length,
        });

        try {
          console.log("🎯 Submitting question to LangChain");
          const eventStream = await submitQuestion(langChainMessages, chatId);

          for await (const event of eventStream) {
            console.log("📦 Processing event:", { eventType: event.event });

            if (event.event === "on_chat_model_stream") {
              const token = event.data.chunk;
              if (token) {
                const text = token.content.at(0)?.["text"];
                if (text) {
                  console.log("🗨️ Streaming token:", {
                    text: text.substring(0, 20) + "...",
                  });
                  await sendSSEMessage(writer, {
                    type: StreamMessageType.Token,
                    token: text,
                  });
                }
              }
            } else if (event.event === "on_tool_start") {
              console.log("🛠️ Tool execution starting:", {
                tool: event.name,
                input: event.data.input,
              });
              await sendSSEMessage(writer, {
                type: StreamMessageType.ToolStart,
                tool: event.name || "unknown",
                input: event.data.input,
              });
            } else if (event.event === "on_tool_end") {
              console.log("✅ Tool execution completed:", { tool: event.name });
              const toolMessage = new ToolMessage(event.data.output);
              await sendSSEMessage(writer, {
                type: StreamMessageType.ToolEnd,
                tool: toolMessage.lc_kwargs.name || "unknown",
                output: event.data.output,
              });
            }
          }

          console.log("🏁 Stream processing completed");
          await sendSSEMessage(writer, { type: StreamMessageType.Done });
        } catch (streamError) {
          console.error("❌ Stream processing error:", streamError);
          await sendSSEMessage(writer, {
            type: StreamMessageType.Error,
            error:
              streamError instanceof Error
                ? streamError.message
                : "Stream processing failed",
          });
        }
      } catch (error) {
        console.error("❌ Stream error:", error);
        await sendSSEMessage(writer, {
          type: StreamMessageType.Error,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        console.log("🔚 Closing stream writer");
        try {
          await writer.close();
        } catch (closeError) {
          console.error("❌ Error closing writer:", closeError);
        }
      }
    })();

    console.log("✨ Returning response");
    return response;
  } catch (error) {
    console.error("❌ Fatal API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" } as const,
      { status: 500 }
    );
  }
}
