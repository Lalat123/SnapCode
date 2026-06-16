# SnapCode

SnapCode is a lightning-fast, beautifully designed, online compiler and execution sandbox built for speed. It allows users to write, compile, and execute code directly in their browser.

## Features
- **Multi-language Support:** Write and execute code in Python, C++, Java, and JavaScript.
- **Custom Inputs:** Pipe custom `stdin` directly into your programs to test specific edge cases.
- **Execution Metrics:** Get instant feedback on execution time and memory consumption.
- **Stunning UI:** Built with an aesthetically pleasing dark-mode layout featuring micro-animations, customizable editor themes, font sizing, and robust code styling.
- **Save Templates:** Save your customized competitive programming boilerplate code for one-click recovery.

## Tech Stack
- **Frontend:** React.js, Vite, Monaco Editor (VS Code core)
- **Backend:** Node.js, Express.js
- **Execution Engine:** Asynchronous native process execution (`child_process.exec`) measuring exact metrics.

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- Python, GCC (`g++`), and Java (`javac` / `java`) installed and configured in your system PATH for full language support.

### 1. Start the Backend
Open a terminal in the `backend` folder and run:
```bash
npm install
npm start
```
The backend engine will start on port `5000`.

### 2. Start the Frontend
Open a new terminal in the `frontend` folder and run:
```bash
npm install
npm run dev
```
The frontend UI will start. Open `http://localhost:5173/` in your browser.

## License
MIT
