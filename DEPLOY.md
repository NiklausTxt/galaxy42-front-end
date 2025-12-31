# Docker 部署指南

## 快速部署

### 方法一：使用 Docker Compose（推荐）

1. **上传文件到服务器**
   ```bash
   # 将整个项目文件夹上传到服务器
   scp -r frontEnd user@your-server:/path/to/
   ```

2. **构建并启动容器**
   ```bash
   cd /path/to/frontEnd
   docker-compose up -d
   ```

3. **查看日志**
   ```bash
   docker-compose logs -f
   ```

4. **停止服务**
   ```bash
   docker-compose down
   ```

### 方法二：使用 Docker 命令

1. **构建镜像**
   ```bash
   docker build -t ai-chatbot:latest .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name ai-chatbot \
     -p 8080:8080 \
     --restart unless-stopped \
     ai-chatbot:latest
   ```

3. **查看日志**
   ```bash
   docker logs -f ai-chatbot
   ```

4. **停止容器**
   ```bash
   docker stop ai-chatbot
   docker rm ai-chatbot
   ```

## 访问地址

部署成功后，通过以下地址访问：

- **服务器IP:8080**
  例如：`http://47.97.38.226:8080`

## 管理命令

```bash
# 查看运行状态
docker ps

# 查看容器资源使用情况
docker stats ai-chatbot

# 进入容器
docker exec -it ai-chatbot sh

# 重启容器
docker restart ai-chatbot

# 查看容器日志
docker logs --tail 100 -f ai-chatbot

# 清理未使用的镜像
docker image prune
```

## 配置修改

如果需要修改API密钥或其他配置：

1. 编辑 `server.js` 中的配置
2. 重新构建镜像：`docker-compose up -d --build`

## 防火墙配置

确保服务器防火墙开放8080端口：

```bash
# 阿里云ECS需要在安全组中添加规则
# 允许TCP端口 8080

# 如果使用iptables
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT

# 如果使用ufw
sudo ufw allow 8080
```

## 使用 Nginx 反向代理（可选）

如果希望通过80端口访问，可以配置Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 常见问题

**Q: 端口被占用怎么办？**
```bash
# 修改 docker-compose.yml 中的端口映射
ports:
  - "3000:8080"  # 将宿主机端口改为3000
```

**Q: 如何更新应用？**
```bash
git pull  # 或重新上传文件
docker-compose down
docker-compose up -d --build
```

**Q: 如何查看实时日志？**
```bash
docker-compose logs -f --tail=100
```
