# AI Chatbot (React Refactor)

This is a modern React + Vite refactor of the original Galaxy42 frontend.

## Project Structure

*   `src/`: Source code
    *   `components/`: UI Components (ChatInput, Message)
    *   `services/`: API logic
    *   `App.jsx`: Main application logic
*   `server.js`: Backend proxy server (Node.js)
*   `dist/`: Production build output (generated after build)
*   `legacy/`: Original Vanilla JS files

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run in Development Mode:**
    (Starts Vite dev server on port 5173 and Node proxy on port 3000)
    ```bash
    npm run server & npm run dev
    ```
    *Note: You need to run both commands. `npm run dev` handles the frontend, but it needs `server.js` running for the API proxy.*

    **Better way for dev:**
    Open two terminals:
    1. `npm run server` (Backend)
    2. `npm run dev` (Frontend)

3.  **Build for Production:**
    ```bash
    npm run build
    ```

4.  **Run Production Server:**
    ```bash
    npm run server
    ```
    (Serves the `dist/` folder on http://localhost:3000)