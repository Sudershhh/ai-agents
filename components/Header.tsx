"use client";
import React, { use } from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/clerk-react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { NavigationContext } from "@/lib/NavigationProvider";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function Header() {
  const { setIsMobileNavOpen } = use(NavigationContext);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-b border-purple-100/20 bg-white/80 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-500 hover:text-indigo-600 hover:bg-purple-50"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            >
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </motion.div>
            <h1 className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Chat with an AI Agent
            </h1>
          </div>
        </div>

        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 ring-2 ring-purple-100 ring-offset-2 rounded-full transition-shadow hover:ring-purple-200",
              },
            }}
          />
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
