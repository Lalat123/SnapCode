# SnapCode – Lightning Fast Execution Sandbox

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)


SnapCode is a smart, web-based online code compiler and execution sandbox built with React and Node.js. It allows users to seamlessly write, compile, and execute code in multiple languages directly in their browser. Basically, it helps developers test logic, pipe custom inputs, and analyze execution metrics in a fast, distraction-free environment.

## Features
- **Multi-language Support** – Write and execute code in Python, C++, Java, and JavaScript effortlessly.
- **Custom Inputs** – Pipe custom `stdin` directly into your programs to test specific edge cases and logic.
- **Execution Metrics** – Provides instant feedback on precise execution time and estimated memory consumption.
- **Save Templates** – Save your custom competitive programming boilerplate code for one-click recovery.
- **Aesthetic Editor** – Built on Monaco Editor with customizable font sizes, tab sizes, soft wrapping, and autocomplete features.
- **Dark Mode Themes** – Offers multiple visually appealing themes (VS Code Dark, High Contrast, Light) for comfortable use.
- **Interactive UI** – Built with a beautifully structured split-pane interface and fluid micro-animations.

## Directory Structure
```text
SnapCode/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── submissions.js
│   │   ├── executor.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── IDE.jsx
│   │   ├── Login.jsx
│   │   ├── index.css
│   │   └── login.css
│   └── package.json
└── README.md
```

## 🛠️ Technologies Used

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)

- **JavaScript/Node.js** – Core programming language for logic and backend processing.
- **Express.js** – Lightweight web framework used for backend routing and API handling.
- **React.js & Vite** – For building the lightning-fast, modular user interface.
- **Monaco Editor** – Powers the robust in-browser code editor experience.
- **Lucide React** – Used for clean and intuitive iconography.
- **CSS3** – For styling the layout, animations, and split-screen appearance.
- **child_process** – Native Node.js module used to securely execute untrusted binary scripts.

## Installation

Create a clone or download the repository to your local machine.

**1. Start the Backend:**
Open a terminal in the `backend` folder and install dependencies:
```bash
npm install
```
Start the server:
```bash
node --watch src/index.js
```
*The backend engine will start on port `5000`.*

**2. Start the Frontend:**
Open a new terminal in the `frontend` folder and install dependencies:
```bash
npm install
```
Run the application:
```bash
npm run dev
```

Open your browser and visit:
`http://localhost:5173`

## Usage
1. Launch the application and enter any mock details on the Login screen to bypass the gateway.
2. Select your desired programming language from the dropdown menu (Python, C++, Java, or JS).
3. Write your code in the main editor panel.
4. Enter any standard input required by your program in the **Custom Input** textarea.
5. Click **Run** to compile and execute your code.
6. Review the output pane for your program's raw output, execution status, and time/memory metrics.
7. Click the **Settings** gear to customize your editor theme, save code templates, or adjust font sizes.

## Execution Logic
SnapCode uses an asynchronous native execution pipeline that interacts directly with your system's installed compilers. It ensures:
- **Direct Compilation** – Uses system `g++` and `javac` to natively compile C++ and Java code.
- **I/O Piping** – Seamlessly writes user code and custom inputs to temporary files and pipes them to `stdin`.
- **Safety Limits** – Implements strict timeout limits to kill processes that enter infinite loops (Time Limit Exceeded).
- **Cleanup** – Automatically wipes temporary execution directories after the run completes to save space.

## Metrics Section
After executing a piece of code, SnapCode provides a built-in output panel that offers:
- **Status Reporting** – Clearly states if the code was "Successfully executed", threw a "Compilation Error", or hit a "Runtime Error".
- **Execution Time** – Precise performance benchmarking calculated using high-resolution Node timers.
- **Memory Consumption** – An estimate of the peak memory footprint used during the script's lifespan.

## Future Improvements
While SnapCode currently runs as a blazing-fast local sandbox, several enhancements are planned to make it production-ready:
- **Docker Isolation** – Containerize the execution engine to securely run untrusted code on a public server.
- **Database Integration** – Persist user accounts, saved templates, and past submissions using MongoDB or PostgreSQL.
- **Authentication** – Replace the mocked login screen with secure JWT-based authentication.

## License
This project is licensed under the MIT License.
