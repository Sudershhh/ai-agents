import {
  Bot,
  BookOpen,
  Youtube,
  Search,
  Database,
  MessageSquareCode,
} from "lucide-react";
import { motion } from "framer-motion";

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
    icon: Database,
    title: "Data Processing",
    description: "Process complex data structures",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function WelcomeMessage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4"
    >
      <motion.div
        variants={item}
        className="w-full bg-gradient-to-b from-white to-gray-50/90 rounded-3xl shadow-sm ring-1 ring-purple-100/20 px-6 py-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-[0.03]" />

        <div className="relative">
          <motion.div
            variants={item}
            className="flex items-center justify-center mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-100 to-indigo-100"
            >
              <Bot className="w-8 h-8 text-indigo-600" />
            </motion.div>
          </motion.div>

          <motion.h2
            variants={item}
            className="text-2xl font-semibold text-center mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Welcome to AI Agent Chat!
          </motion.h2>

          <motion.p variants={item} className="text-gray-600 text-center mb-8">
            I'm your AI assistant, ready to help you with various tasks using
            powerful tools and capabilities.
          </motion.p>

          <motion.div
            variants={item}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className={`flex items-start gap-3 p-4 rounded-xl bg-white/50 backdrop-blur border ${feature.borderColor} hover:bg-white/80 transition-colors`}
              >
                <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            variants={item}
            className="text-center text-sm text-gray-500 mt-6"
          >
            Start by typing your question or request in the input box below
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
