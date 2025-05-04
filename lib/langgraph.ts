import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from "@wxflows/sdk/langchain";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";
import SYSTEM_MESSAGE from "@/constants/systemMessage";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";

//TRIM the messages to manage conversation history
const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

//Connect to IBMWX flows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_API_KEY,
});

//Retrieve the tools
const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

const initializeModel = () => {
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 4096,
    streaming: true,

    callbacks: [
      {
        handleLLMStart: async () => {
          //console.log("Starting LLM Call")
        },
        handleLLMEnd: async (output) => {
          const usage = output.llmOutput?.usage;
          if (usage) {
          }
        },
      },
    ],
  }).bindTools(tools);

  return model;
};

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  //If LLM makes a Tool Call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  //If the last message is a tool message, route back to agent

  if (lastMessage.content && lastMessage._getType() === "tool") {
    return "agent";
  }

  //Otherwise, we stop (reply to the user)
  return END;
}

const createWorkflow = () => {
  const model = initializeModel();
  const stateGraph = new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      //Create system message content
      const systemContent = SYSTEM_MESSAGE;

      //Create the prompt template with system message and messages placeholder
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" }, //set a cache breakpoint (max = 4)
        }),
        new MessagesPlaceholder("messages"),
      ]);

      //Trim the messages to manage the conversation history
      const trimmedMessages = await trimmer.invoke(state.messages);

      //Format the prompt with the current messages
      const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

      //Get response from the model
      const response = await model.invoke(prompt);

      return { messages: [response] };
    })
    .addEdge(START, "agent")
    .addNode("tools", toolNode)
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  return stateGraph;
};

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
  //RULES OF CACHING HEADERS for Turn-By-Turn Conversations
  // 1. Cache the first system message
  // 2. Cache the last message
  // 3. Cache the 2nd-to-last human mesage

  if (!messages.length) return messages;

  //Create a copy of messages to avoid mutating the original

  const cachedMessages = [...messages];

  //Helper to add cache control
  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: "text",
        text: message.content as string,
        cache_control: { type: "ephemeral" },
      },
    ];
  };

  //Cache the last message
  addCache(cachedMessages.at(-1)!);

  //Find and cache the 2nd-to-last human message
  let humanCount = 0;
  for (let i = cachedMessages.length - 1; i >= 0; i--) {
    if (cachedMessages[i] instanceof HumanMessage) {
      humanCount++;
      if (humanCount === 2) {
        addCache(cachedMessages[i]);
        break;
      }
    }
  }

  return cachedMessages;
}

export async function submitQuestion(messages: BaseMessage[], chatId: string) {
  const cachedMessages = addCachingHeaders(messages);

  const workflow = createWorkflow();

  //Create a checkpoint to save the state of the conversation
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  //Run the graph and stream
  const stream = await app.streamEvents(
    {
      messages: cachedMessages,
    },
    {
      version: "v2",
      configurable: {
        thread_id: chatId,
      },
      streamMode: "messages",
      runId: chatId,
    }
  );

  return stream;
}
