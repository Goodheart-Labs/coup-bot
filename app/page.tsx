"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi I think Trump attempted a coup, which culminated in the events of Jan 6th 2021. Can you convince me otherwise?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = async (input: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      console.log("Frontend received:", data); // For debugging
      console.log("Frontend received raw:", JSON.stringify(data)); // For debugging exact string content
      return (
        data.text ||
        "I apologize, but I encountered an error. Please try again."
      );
    } catch (error) {
      console.error("Error calling API:", error);
      return "I apologize, but I encountered an error. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const response = await generateResponse(inputText);

    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: "bot",
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold text-center">
          Coup-bot - Can you convince me there wasn't a coup?
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <div className="space-y-2">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      sup: ({ ...props }) => {
                        console.log("Sup component called");
                        console.log("Sup props:", JSON.stringify(props));
                        return (
                          <sup className="text-xs align-super" {...props} />
                        );
                      },
                      a: ({ ...props }) => (
                        <a
                          className="text-blue-500 hover:underline"
                          {...props}
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol className="list-decimal list-inside" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc list-inside" {...props} />
                      ),
                    }}
                  >
                    {message.text || ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-white text-gray-800">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
