import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div class="fixed inset-0 bg-gradient-to-r from-blue-50 to-blue-100">
      <div class="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header class="text-center py-4">
          <a
            href="https://github.com/am-aru/chatbot-ai"
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          >
            <h1 class="text-4xl font-bold text-blue-500 hover:text-blue-600 transition-colors">
              Chat AI
            </h1>
          </a>
        </header>

        <div
          ref={chatContainerRef}
          class="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-lg p-4 hide-scrollbar"
        >
          {chatHistory.length === 0 ? (
            <div class="h-full flex flex-col items-center justify-center text-center p-6">
              <div class="bg-blue-50 rounded-xl p-8 max-w-2xl">
                <h2 class="text-2xl font-bold text-blue-600 mb-4">
                  Welcome to Chat AI! 👋
                </h2>
                <p class="text-gray-600 mb-4">
                  I'm here to help you with anything you'd like to know. You can
                  ask me about:
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div class="bg-white p-4 rounded-lg shadow-sm">
                    <span class="text-blue-500">💡</span> General knowledge
                  </div>
                  <div class="bg-white p-4 rounded-lg shadow-sm">
                    <span class="text-blue-500">🔧</span> Technical questions
                  </div>
                  <div class="bg-white p-4 rounded-lg shadow-sm">
                    <span class="text-blue-500">📝</span> Writing assistance
                  </div>
                  <div class="bg-white p-4 rounded-lg shadow-sm">
                    <span class="text-blue-500">🤔</span> Problem solving
                  </div>
                </div>
                <p class="text-gray-500 mt-6 text-sm">
                  Just type your question below and press Enter or click Send!
                </p>
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  class={`mb-4 ${
                    chat.type === "question" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    class={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                      chat.type === "question"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <ReactMarkdown class="overflow-auto hide-scrollbar">
                      {chat.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </>
          )}
          {generatingAnswer && (
            <div class="text-left">
              <div class="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form
          onSubmit={generateAnswer}
          class="bg-white rounded-lg shadow-lg p-4"
        >
          <div class="flex gap-2">
            <textarea
              required
              class="flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              class={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
