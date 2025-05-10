// "use client";

// import { useRouter } from "next/navigation";
// import { NavigationContext } from "@/lib/NavigationProvider";
// import { useContext, useState } from "react";
// import { Button } from "./ui/button";
// import { PlusIcon } from "@radix-ui/react-icons";
// import { cn } from "@/lib/utils";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import ChatRow from "./ChatRow";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2 } from "lucide-react";

// function Sidebar() {
//   const router = useRouter();
//   const { closeMobileNav, isMobileNavOpen } = useContext(NavigationContext);
//   const [isCreating, setIsCreating] = useState(false);

//   const chats = useQuery(api.chats.listChats);
//   const createChat = useMutation(api.chats.createChat);
//   const deleteChat = useMutation(api.chats.deleteChat);

//   const handleNewChat = async () => {
//     setIsCreating(true);
//     try {
//       const chatId = await createChat({ title: "New Chat" });
//       router.push(`/dashboard/chat/${chatId}`);
//       closeMobileNav();
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   const handleDeleteChat = async (id: Id<"chats">) => {
//     await deleteChat({ id });
//     if (window.location.pathname.includes(id)) {
//       router.push("/dashboard");
//     }
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {isMobileNavOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
//             onClick={closeMobileNav}
//           />
//         )}
//       </AnimatePresence>

//       <motion.div
//         initial={{ x: "-100%" }}
//         animate={{ x: isMobileNavOpen ? 0 : "-100%" }}
//         transition={{ type: "spring", damping: 20, stiffness: 100 }}
//         className={cn(
//           "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 w-72 bg-white border-r border-purple-100/20 shadow-xl md:shadow-none transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
//           "md:bg-gradient-to-b md:from-gray-50 md:to-white",
//           isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="p-4 border-b border-purple-100/20">
//           <Button
//             className={cn(
//               "w-full relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-xl py-6 shadow-md hover:shadow-lg transition-all duration-200",
//               !isCreating && "hover:-translate-y-0.5"
//             )}
//             onClick={handleNewChat}
//             disabled={isCreating}
//           >
//             {isCreating ? (
//               <>
//                 <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <PlusIcon className="mr-2 h-5 w-5" />
//                 New Chat
//               </>
//             )}
//             {isCreating && (
//               <div
//                 className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
//                 style={{ transform: "translateX(-100%)" }}
//               />
//             )}
//           </Button>
//         </div>

//         <motion.div
//           className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent space-y-2"
//           layout
//         >
//           <AnimatePresence mode="popLayout" initial={false}>
//             {chats?.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="text-center py-8 text-gray-500 text-sm"
//               >
//                 No chats yet. Start a new conversation!
//               </motion.div>
//             ) : (
//               chats?.map((chat) => (
//                 <motion.div
//                   key={chat._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   <ChatRow chat={chat} onDelete={handleDeleteChat} />
//                 </motion.div>
//               ))
//             )}
//           </AnimatePresence>
//         </motion.div>
//       </motion.div>
//     </>
//   );
// }

// export default Sidebar;

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
function Sidebar() {
  const router = useRouter();
  const { closeMobileNav, isMobileNavOpen } = use(NavigationContext);

  const chats = useQuery(api.chats.listChats);

  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  // const handleClick = () => {
  //   closeMobileNav();
  // };

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
          "fixed md:inset-y-0 top-14 bottom-0 left-0 z-50 w-72 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:top-0 flex flex-col",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b border-gray-200/50">
          <Button
            className="w-full bg-white cursor-pointer hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm hover:shadow transition-all duration-200"
            onClick={handleNewChat}
          >
            <PlusIcon />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 p-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {chats?.map((chat) => (
            <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
