import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';
import { CHATBOT_SYSTEM_INSTRUCTION } from '../constants';
import ChatIcon from './icons/ChatIcon';
import { Chat, GenerateContentResponse } from '@google/genai';

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            const chatManager = geminiService.getChatManager();
            chatRef.current = chatManager.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
                },
            });
            // Add initial bot message
            setMessages([{
                id: `bot-${Date.now()}`,
                sender: 'bot',
                text: "Hello! I'm MedAI+, your AI health assistant. Please remember, I'm not a doctor and my advice is not a substitute for professional medical care. How can I help you today?"
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const renderMessageText = (text: string) => {
        const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <div dangerouslySetInnerHTML={{ __html: html }} className="whitespace-pre-wrap" />;
    };

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chatRef.current || isLoading) return;

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            text: userInput,
        };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        const botMessageId = `bot-${Date.now()}`;
        // Add a placeholder for the streaming response
        setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '' }]);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: userInput });
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                setMessages(prev => prev.map(msg =>
                    msg.id === botMessageId ? { ...msg, text: msg.text + chunkText } : msg
                ));
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-24 right-5 sm:right-8 w-[calc(100%-2.5rem)] sm:w-96 h-[65vh] max-h-[700px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-t-xl">
                    <h3 className="font-bold text-lg">MedAI+ Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-500 rounded-full">&times;</button>
                </header>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                            <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {renderMessageText(msg.text)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-3">
                           <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-xl">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask a health question..."
                            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 disabled:bg-gray-400" disabled={isLoading || !userInput.trim()}>
                            Send
                        </button>
                    </div>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-5 sm:right-8 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
                aria-label="Toggle AI Assistant"
            >
                <ChatIcon className="w-8 h-8" />
            </button>
        </>
    );
};

export default Chatbot;
