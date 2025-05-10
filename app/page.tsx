import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight, BookOpen, Youtube, Search } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="h-screen overflow-hidden relative flex items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] opacity-[0.05]" />
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#e9d5ff,transparent)]" />
      </div>

      <section className="w-full px-4 mx-auto max-w-7xl relative">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-purple-100 animate-fade-in">
            <span className="px-3 py-1 text-sm text-purple-700 bg-purple-100 rounded-full">
              New
            </span>
            <span className="ml-3 text-sm text-gray-700">
              Powered by IBM&apos;s WxTools & Advanced LLMs
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            AI Agent Assistant
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            Experience the next generation of AI interaction - where
            conversation meets action. Your intelligent companion for research,
            analysis, and task automation.
          </p>

          <div className="flex items-center justify-center gap-4">
            <SignedIn>
              <Link href="/dashboard">
                <button className="group cursor-pointer relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton
                mode="modal"
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
              >
                <button className="group cursor-pointer relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                  Sign Up Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Feature Grid - Now more compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 max-w-6xl mx-auto">
          {/* YouTube Integration */}
          <div className="group p-6 bg-white/80 backdrop-blur rounded-2xl border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-red-100 text-red-600">
                <Youtube className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Video Analysis
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Extract and analyze YouTube video transcripts with AI processing
            </p>
          </div>

          {/* Google Books */}
          <div className="group p-6 bg-white/80 backdrop-blur rounded-2xl border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Book Research
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Search and analyze content from millions of books instantly
            </p>
          </div>

          {/* Wikipedia */}
          <div className="group p-6 bg-white/80 backdrop-blur rounded-2xl border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-green-100 text-green-600">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Knowledge Base
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Access Wikipedia with intelligent search and summarization
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </section>
    </main>
  );
}
