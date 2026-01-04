// 聊天机器人配置
const CONFIG = {
    API_URL: '/api/chat',  // 使用本地代理
    API_KEY: 'sk-61795bb85ffc4d4c9c3025d2bd0df8f9',
    MODEL: 'qwen-plus'
};

// 聊天历史记录
let chatHistory = [];

// DOM元素
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// 初始化
function init() {
    // 绑定事件
    sendButton.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', handleKeyDown);
    chatInput.addEventListener('input', autoResize);

    // 聚焦输入框
    chatInput.focus();
}

// 处理发送按钮
async function handleSend() {
    const message = chatInput.value.trim();
    if (!message) return;

    // 添加用户消息到界面
    addMessageToUI('user', message);
    chatHistory.push({ role: 'user', content: message });

    // 清空输入框
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // 禁用发送按钮
    setSendingState(true);

    try {
        // 显示输入指示器
        const typingIndicator = showTypingIndicator();

        // 发送请求并处理流式响应
        await streamChat(message, (chunk) => {
            // 移除输入指示器
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
        });

    } catch (error) {
        console.error('发送消息失败:', error);
        addErrorMessage(error.message || '发送消息失败，请重试');
    } finally {
        // 恢复发送按钮
        setSendingState(false);
    }
}

// 流式聊天
async function streamChat(userMessage, onFirstChunk) {
    let assistantMessage = '';
    let assistantMessageElement = null;
    let firstChunk = true;

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: chatHistory,
                stream: true,
                stream_options: { include_usage: true }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                const trimmedLine = line.trim();

                if (!trimmedLine || !trimmedLine.startsWith('data:')) {
                    continue;
                }

                const data = trimmedLine.slice(5).trim();

                if (data === '[DONE]') {
                    continue;
                }

                try {
                    const parsed = JSON.parse(data);

                    // 处理第一个chunk
                    if (firstChunk) {
                        onFirstChunk();
                        firstChunk = false;
                    }

                    // 提取内容
                    if (parsed.choices && parsed.choices[0]?.delta?.content) {
                        const content = parsed.choices[0].delta.content;
                        assistantMessage += content;

                        // 更新UI
                        if (!assistantMessageElement) {
                            assistantMessageElement = addMessageToUI('assistant', '');
                        }
                        updateMessageContent(assistantMessageElement, assistantMessage);
                    }

                } catch (e) {
                    // 忽略解析错误
                    console.warn('解析失败:', data);
                }
            }
        }

        // 添加助手消息到历史
        if (assistantMessage) {
            chatHistory.push({ role: 'assistant', content: assistantMessage });
        }

    } catch (error) {
        throw error;
    }
}

// 添加消息到UI
function addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // 滚动到底部
    scrollToBottom();

    return contentDiv;
}

// 更新消息内容
function updateMessageContent(element, content) {
    // 简单处理换行和格式
    const formattedContent = formatMessage(content);
    element.innerHTML = formattedContent;
    scrollToBottom();
}

// 格式化消息
function formatMessage(content) {
    // 处理代码块
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
    });

    // 处理行内代码
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 处理换行
    content = content.replace(/\n/g, '<br>');

    return content;
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 显示输入指示器
function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'typing-indicator';
    indicatorDiv.innerHTML = '<span></span><span></span><span></span>';

    messageDiv.appendChild(indicatorDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    return messageDiv;
}

// 添加错误消息
function addErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content error-message';
    contentDiv.textContent = `❌ ${message}`;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// 滚动到底部
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 设置发送状态
function setSendingState(sending) {
    sendButton.disabled = sending;
    chatInput.disabled = sending;
}

// 处理键盘事件
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
}

// 自动调整输入框高度
function autoResize() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
