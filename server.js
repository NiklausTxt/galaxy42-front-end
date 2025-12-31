const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// 代理服务器配置
const PROXY_CONFIG = {
    PORT: 8080,
    API_TARGET: 'http://47.97.38.226',
    API_KEY: 'sk-61795bb85ffc4d4c9c3025d2bd0df8f9'
};

// MIME类型映射
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// 创建代理服务器
const server = http.createServer((req, res) => {
    // 处理API请求代理
    if (req.url === '/api/chat' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const options = {
                    hostname: '47.97.38.226',
                    port: 80,
                    path: '/chat',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${PROXY_CONFIG.API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                };

                const proxyReq = http.request(options, (proxyRes) => {
                    // 设置CORS头
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                    res.writeHead(proxyRes.statusCode, proxyRes.headers);
                    proxyRes.pipe(res);
                });

                proxyReq.on('error', (error) => {
                    console.error('代理请求错误:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: '代理请求失败' }));
                });

                proxyReq.write(body);
                proxyReq.end();

            } catch (error) {
                console.error('处理请求错误:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '服务器错误' }));
            }
        });

        return;
    }

    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.writeHead(200);
        res.end();
        return;
    }

    // 处理静态文件
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 文件未找到</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`服务器错误: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = PROXY_CONFIG.PORT;
server.listen(PORT, () => {
    console.log(`\n🚀 服务器运行成功！`);
    console.log(`\n访问地址:`);
    console.log(`  本地: http://localhost:${PORT}`);
    console.log(`  局域网: http://10.10.16.128:${PORT}`);
    console.log(`\n按 Ctrl+C 停止服务器\n`);
});
