import React from 'react';

const Message = ({ role, content }) => {
    const isUser = role === 'user';
    
    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div 
                className={`
                    max-w-[80%] rounded-2xl px-4 py-2.5 
                    ${isUser 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100'
                    }
                `}
            >
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default Message;
