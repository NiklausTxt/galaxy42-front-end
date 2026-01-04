import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="border-t bg-white p-4">
            <form 
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto relative flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all"
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息..."
                    disabled={disabled}
                    className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-gray-800 text-sm h-[24px] max-h-[120px] py-1 px-2"
                    rows={1}
                    style={{
                        height: 'auto',
                        minHeight: '24px'
                    }}
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={disabled || !input.trim()}
                    className={`
                        p-2 rounded-lg transition-colors
                        ${disabled || !input.trim() 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
                    `}
                >
                    {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
