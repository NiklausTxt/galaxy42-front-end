# galaxy42-front-end

## Project Overview

This project is a lightweight, frontend-focused AI Chatbot application. It provides a clean web interface for users to interact with an AI model (configured as `qwen-plus`).

The architecture consists of:
1.  **Frontend:** A vanilla JavaScript/HTML/CSS Single Page Application (SPA).
2.  **Backend Proxy:** A simple Node.js server (`server.js`) that serves static files and proxies chat API requests to an upstream server to handle authentication and CORS.

## Architecture & Key Files

*   **`server.js`**: The core application server.
    *   **Role:** Acts as both a static file server and an API proxy.
    *   **Logic:** It listens on port 3000. It intercepts `POST /api/chat` requests and forwards them to `http://47.97.38.226/chat` with the necessary API key. All other requests are treated as static file requests.
    *   **Dependencies:** Uses only Node.js built-in modules (`http`, `fs`, `path`), so no `npm install` is strictly required.
*   **`app.js`**: Client-side logic.
    *   **Role:** Manages the chat UI and state.
    *   **Logic:** Handles user input, maintains chat history, and processes streaming responses (Server-Sent Events style) from the API.
*   **`index.html`**: The main entry point for the browser.
*   **`style.css`**: Application styling.
*   **`Dockerfile` / `docker-compose.yml`**: Configuration for containerized deployment.

## Building and Running

### Prerequisites
*   Node.js (for local execution)
*   Docker & Docker Compose (for containerized execution)

### Local Development

Since there are no external dependencies, you can run the server directly:

```bash
node server.js
```

*   Access the app at `http://localhost:3000`

### Docker Deployment

To run the application using Docker Compose:

```bash
docker-compose up -d --build
```

To stop the application:

```bash
docker-compose down
```

## Configuration

Configuration is currently embedded in the source files:

*   **Server Port & API Target:** defined in `server.js` (`PROXY_CONFIG` object).
*   **Frontend API Endpoint & Model:** defined in `app.js` (`CONFIG` object).

*Note: The `DEPLOY.md` file contains additional deployment instructions, including Nginx configuration examples, though it references port 8080 while the current code uses 3000.*

## Development Conventions

*   **Pure JS:** The project avoids build tools (Webpack, Vite, etc.) and external libraries (React, Vue, Express) in favor of standard web technologies and Node.js built-ins.
*   **Streaming:** The frontend is designed to handle streaming responses using the Fetch API and `TextDecoder`.
*   **Styling:** Custom CSS without preprocessors.
