"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  id: string
  role: "user" | "agent"
  content: string
  timestamp: Date
}

export default function QueryPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      content: "Hello! I'm your deployment agent. How can I assist you with your configuration today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input.toLowerCase()
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      let responseContent = ""

      // Check for system health queries
      if (
        userInput.includes("system") ||
        userInput.includes("doing") ||
        userInput.includes("health") ||
        userInput.includes("status")
      ) {
        responseContent =
          "Great news! Your system is performing excellently. All agents are deployed and healthy. Here's a quick summary:\n\n✓ All 3 agents are running smoothly\n✓ CPU usage is optimal (averaging 2-3%)\n✓ Memory consumption is within normal ranges\n✓ Network connectivity is stable\n✓ API endpoints are responding correctly\n\nEverything is operating as expected. Is there anything specific you'd like to check?"
      }
      // Check for deployment queries
      else if (userInput.includes("deploy") || userInput.includes("agent")) {
        responseContent =
          "Your agents are successfully deployed and running! All containers are healthy and responding to requests. The deployment completed without any issues."
      }
      // Check for configuration queries
      else if (userInput.includes("config") || userInput.includes("configuration")) {
        responseContent =
          "Your configuration has been successfully applied. All agents are running with the specified settings and are operating within expected parameters."
      }
      // Default helpful response
      else {
        responseContent =
          "I've received your message. I'm here to help you monitor and manage your deployed agents. You can ask me about system health, deployment status, or any configuration concerns you might have."
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: responseContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Query Agent</h1>
          <p className="text-muted-foreground leading-relaxed">
            Chat with the deployment agent to get help with your configurations
          </p>
        </div>

        <Card className="flex flex-col h-[calc(100vh-16rem)] border-2 border-primary">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary/20 p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                className="min-h-[60px] max-h-[200px] resize-none border-2 border-primary/20 focus:border-primary"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-6"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
