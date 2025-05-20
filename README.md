# AI Agent Assistant

An AI agent platform that combines multiple tools and services into a single, intuitive interface. Built with modern web technologies and designed for seamless user experience.

## Features

- **YouTube Analysis**: Extract and analyze video transcripts with AI processing
- **Google Books Integration**: Search and analyze content from millions of books
- **Wikipedia Search**: Access vast knowledge with intelligent search and summarization
- **JSONata Processing**: Advanced data transformation capabilities
- **Real-time Chat Interface**: Seamless interaction with AI agents
- **Modern UI/UX**: Beautiful, responsive design with smooth animations

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend**: Convex (Real-time Database)
- **Authentication**: Clerk
- **AI Integration**: LangChain, IBM WxTools SDK
- **Styling**: Tailwind CSS, Radix UI
- **Development**: TypeScript, ESLint

## Getting Started

1. **Clone the repository**:

```bash
git clone [repository-url]

```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CONVEX_URL=your_convex_url
WXFLOWS_ENDPOINT=your_wxflows_endpoint
WXFLOWS_APIKEY=your_wxflows_apikey
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

ai-agents/
├── app/ # Next.js app directory
├── components/ # React components
├── convex/ # Convex backend functions
├── lib/ # Utility functions and types
├── public/ # Static assets
└── constants/ # Application constants

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Next.js](https://nextjs.org)
- [Convex](https://www.convex.dev)
- [Clerk](https://clerk.dev)
- [LangChain](https://www.langchain.com)
- [IBM WxTools](https://www.ibm.com/wxflows)
