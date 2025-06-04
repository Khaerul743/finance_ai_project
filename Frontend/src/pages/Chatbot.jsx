import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useWallet } from '../context/WalletContext';
import assistantService from '../services/assistantService';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const chatContainerRef = useRef(null);
  const { activeWallet } = useWallet();

  // Load chat history when component mounts or wallet changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!activeWallet) return;
      
      try {
        setIsLoadingHistory(true);
        const response = await assistantService.getChatHistory(activeWallet.id);
        
        if (response.success) {
          const historyMessages = response.data.map(chat => [
            {
              id: chat.id * 2,
              text: chat.user_message,
              sender: 'user',
              timestamp: new Date(chat.date),
            },
            {
              id: chat.id * 2 + 1,
              text: chat.response,
              sender: 'ai',
              timestamp: new Date(chat.date),
            }
          ]).flat();
          
          setMessages(historyMessages);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [activeWallet]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeWallet) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await assistantService.chat(activeWallet.id, inputMessage);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, You have reached the assistant usage limit. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Finance AI Assistant</h1>
          <p className="text-gray-400">Ask me anything about your finances</p>
        </div>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-4 h-[500px] overflow-y-auto border border-gray-700/50"
        >
          {isLoadingHistory ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
              <p>Loading chat history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-center">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium">
                        {message.sender === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs opacity-70 ml-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-2xl p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={activeWallet ? "Type your message here..." : "Please select a wallet first"}
              disabled={!activeWallet}
              className={`w-full px-4 py-3 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors ${
                !activeWallet ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping || !activeWallet}
            className={`px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 ${
              !inputMessage.trim() || isTyping || !activeWallet
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transform ${isTyping ? 'rotate-90' : ''} transition-transform duration-300`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chatbot;
