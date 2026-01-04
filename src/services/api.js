export const streamChat = async (messages, onChunk, onDone, onError) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen-plus',
                messages: messages,
                stream: true,
                stream_options: { include_usage: true }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = (buffer + chunk).split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

                const data = trimmedLine.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.choices && parsed.choices[0]?.delta?.content) {
                        onChunk(parsed.choices[0].delta.content);
                    }
                } catch (e) {
                    console.warn('Parse error:', data);
                }
            }
        }
        
        onDone();
    } catch (error) {
        onError(error);
    }
};