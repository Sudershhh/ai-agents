import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

      <section className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-10 text-center">
        <header className="space-y-6">
          <h1 className="text-5-xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            AI Agent Assistant
          </h1>
          <p className="max-w-[600px] text-lg text-gray-600 md:text-xl/relaxed xl:text-2xl/relaxed">
            Meet your new AI chat champion that goes beyond conversation - it
            can actually get things done!
            <br />
            <span className="text-gray-400 text-sm">
              Powered by IBM&apos;s WxTools & your favorite LLM&apos;s.
            </span>
          </p>
        </header>

        <SignedIn>
          <Link href={"/dashboard"}>
            <button className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-900 to-gray-800 opacity-30 blur transition duration-300 group-hover:scale-105 group-hover:opacity-100"></div>
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={"/dashboard"}
            forceRedirectUrl={"/dashboard"}
          >
            <button className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium cursor-pointer text-white bg-gray-900 border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none hover:text-white">
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-900 to-gray-800 opacity-30 blur transition duration-300 group-hover:scale-105 group-hover:opacity-100 "></div>
            </button>
          </SignInButton>
        </SignedOut>

        {/* Features Grid */}
        <section className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800">
                Smart Task Automation
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Automate repetitive tasks with AI-powered workflows that learn
                and adapt to your needs
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800">
                Natural Language Processing
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Complex commands simplified through natural conversations with
                our AI assistant
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-lg font-semibold text-gray-800">
                Multi-Agent Collaboration
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Leverage multiple AI agents working together to solve complex
                problems efficiently
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
