import React, { useState, useRef, useEffect } from 'react';
import Message from './components/Message';
import ChatInput from './components/ChatInput';
import { streamChat } from './services/api';

function App() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '你好！我是AI助手，有什么可以帮助你的吗？' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (content) => {
        if (!content.trim()) return;

        const newMessages = [...messages, { role: 'user', content }];
        setMessages(newMessages);
        setIsLoading(true);

        // Add placeholder for assistant response
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        await streamChat(
            newMessages,
            (chunk) => {
                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    const updatedMsg = { ...lastMsg, content: lastMsg.content + chunk };
                    return [...prev.slice(0, -1), updatedMsg];
                });
            },
            () => setIsLoading(false),
            (error) => {
                console.error(error);
                setMessages(prev => [...prev, { role: 'assistant', content: '❌ 发生错误，请重试' }]);
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        AI
                    </div>
                    <h1 className="font-semibold text-gray-800">Chat Assistant</h1>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-4">
                    {messages.map((msg, index) => (
                        <Message key={index} role={msg.role} content={msg.content} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
    );
}

export default App;
