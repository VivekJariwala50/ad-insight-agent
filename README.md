# 🤖 AdInsight Agent (Marketing Intelligence Engine)

**A "Content-First" Marketing Analytics Platform.**

This project is a functional prototype of an **AI Marketing Agent**, designed to demonstrate how Large Language Models (LLMs) and Computer Vision can revolutionize advertising analytics. It moves beyond static dashboards, allowing media buyers to query performance data via natural language and analyze creative assets using AI.

---

## 🚀 Features

### 1. 🗣️ Conversational Analytics (Text-to-SQL)
* **Natural Language Querying:** Transforms questions like *"What is the ROAS for Meta?"* or *"Which campaign spent the most?"* into structured SQL queries automatically.
* **Hybrid Logic Engine:** Uses a robust fall-back architecture. It attempts to use **Google Gemini (LLM)** for complex reasoning but falls back to a deterministic logic engine if the API is unreachable ensuring a **zero-crash demo** environment.

### 2. 👁️ Vision AI Analysis
* **Creative Intelligence:** Demonstrates advanced multi-modal capabilities.
* **Image-to-Insight:** Users can upload ad creatives via the UI paperclip, and the agent analyzes visual tags to predict CTR performance based on historical trends.

### 3. 📊 Dynamic Visualization
* **Context-Aware Charts:** The UI automatically detects numerical datasets and renders interactive **Bar Charts** inside the chat stream.
* **Modern Dashboard:** Built with **Recharts** and **Tailwind CSS**, featuring smooth animations, auto-scrolling, and a "Dark Mode" sidebar inspired by modern SaaS tools like Linear.

---

## 🛠️ Tech Stack & Architecture

This project uses a **Monorepo** structure to simulate a scalable production environment, demonstrating readiness for enterprise-grade infrastructure.

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Architecture** | **Monorepo** | Shared configs, unified build process, mimics enterprise infrastructure. |
| **Frontend** | **Next.js 14 (App Router)** | Server-side rendering for performance; React for interactive UI state. |
| **Styling** | **Tailwind CSS** | Rapid UI development with consistent design tokens. |
| **Backend** | **Node.js / Express** | Lightweight, event-driven API handling. |
| **Database** | **SQLite (Simulated)** | Zero-config SQL database for portability and ease of demonstration. |
| **AI / LLM** | **LangChain + Google Gemini** | Abstraction layer for swapping LLMs; Gemini used for cost/speed efficiency. |

---

## 📂 Folder Structure

```text
ad-insight-agent/
├── apps/
│   ├── api/             # (Node.js/Express)
│   │   ├── src/
│   │   │   ├── index.ts # Hybrid AI/Logic Server
│   │   │   └── seed.ts  # Database Seeder
│   │   └── .env         # API Keys
│   │
│   └── web/             # The "Face" (Next.js 14)
│       ├── app/
│           └── page.tsx # Main Chat Interface (Client Component)
│       
│
├── package.json        
└── README.md
```

## ⚡ Getting Started

### Prerequisites
* Node.js (v18+)
* npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd ad-insight-agent
    ```

2.  **Install dependencies (Root):**
    ```bash
    npm install
    ```

3.  **Setup the Backend:**
    * Create a `.env` file in `apps/api/`:
        ```env
        GOOGLE_API_KEY=your_gemini_key_here
        ```
    * *Note: If no API key is provided, the system automatically switches to "Simulation Mode" so the app still functions perfectly for demos.*

4.  **Run the Application:**
    This command boots up both the Backend (Port 3001) and Frontend (Port 3000) concurrently.
    ```bash
    npm run dev
    ```

5.  **Access the App:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 How to Demo (Walkthrough)

**Scenario 1: Data Analysis**
> **User:** "Check ROAS"
>
> **Agent:** Queries the internal SQLite database, calculates the return on ad spend, and renders a **Bar Chart** comparing campaigns.

**Scenario 2: Granular Detail**
> **User:** "How much did we spend on TikTok?"
>
> **Agent:** Filters the dataset for `platform: 'TikTok'`, aggregates the spend column, and returns a formatted text summary.

**Scenario 3: Vision AI (The "Wow" Factor)**
> **Action:** Click the **Paperclip Icon** 📎 in the input bar.
>
> **Agent:** Simulates scanning an uploaded creative, identifies visual elements, and provides a predictive performance score based on historical data.

---

## 🧠 Design Decisions & Trade-offs

* **Why Express instead of Next.js API Routes?**
    While Next.js handles API routes well, decoupling the backend into a separate Express service allows for heavier computation like image processing or long-running Python scripts without bogging down the frontend rendering server. It aligns with microservices architecture.
* **Why Hybrid AI?**
    For a production demo, reliability is paramount. The system is designed to *try* the LLM first, but if the API fails or hallucinates invalid SQL, it falls back to a deterministic logic engine.

---

## 👨‍💻 Author

**Vivek Tejasbhai Jariwala**
*May 2026 Grad | Full Stack Engineer | Software Engineer*

Built as a proof-of-concept for **Conversational Marketing Analytics**.
