# === 构建阶段 ===
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖定义
COPY package*.json ./

# 安装所有依赖 (包括 devDependencies，因为需要 Vite 构建)
RUN npm install

# 复制源代码
COPY . .

# 执行构建 (生成 dist 目录)
RUN npm run build

# === 运行阶段 ===
FROM node:18-alpine

WORKDIR /app

# 从构建阶段只复制必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.cjs ./

# 这里的 node_modules 我们其实不需要了？
# server.cjs 只用了原生模块。
# 但是如果以后引入了 Express，就需要。
# 为了保险和极简，目前 server.cjs 是零依赖的，所以不需要复制 node_modules
# 如果以后 server.cjs 引入了依赖，需要取消下一行的注释：
# COPY --from=builder /app/node_modules ./node_modules

# 暴露端口
EXPOSE 3000

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动服务
CMD ["npm", "run", "server"]