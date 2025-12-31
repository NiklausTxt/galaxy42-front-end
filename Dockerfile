# 使用官方Node.js镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
# 如果有package.json则安装，否则跳过（因为我们的项目没有package.json）
RUN if [ -f package.json ]; then npm install; fi

# 复制应用文件
COPY index.html ./
COPY style.css ./
COPY app.js ./
COPY server.js ./

# 暴露端口
EXPOSE 3000

# 设置环境变量（可选，可以通过docker run -e覆盖）
ENV NODE_ENV=production
ENV PORT=3000

# 运行应用
CMD ["node", "server.js"]
