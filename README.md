<div align="center">

<br/>

# ⏳ NeverLate

### *"Never miss what matters."*

[![Demo Ready](https://img.shields.io/badge/Demo-Ready-success?style=for-the-badge)]()
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-⚡-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Powered by Coral](https://img.shields.io/badge/Powered_by-Coral_SQL-FF6B6B?style=for-the-badge)](https://coral.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

> Built for the **WeMakeDevs Coral Hackathon** 🚀

</div>

---

<br/>

<div align="center">
  <img src="./assets/neverlate-hero.png" alt="NeverLate Product Interface" width="100%" />
</div>

<br/>

## 🎥 Demo Video

[Watch the 3-minute demo](#)

## 📖 Overview

**NeverLate** is an AI-powered personal life agent. We built it because modern life is heavily fragmented. Our schedules, communications, and commitments are scattered across disconnected applications. NeverLate functions as a secure, personal AI agent that continuously analyzes connected data sources to proactively surface what matters most.

## 🎯 The NeverLate Moment

Imagine it's Tuesday morning.

You have:

* a flight on Friday
* a passport renewal email buried in Gmail
* a project deadline tomorrow
* two overlapping calendar meetings
* a hotel confirmation sitting unread

Individually, each tool knows part of the story.

None of them knows the whole story.

NeverLate connects the dots.

Instead of forcing users to search across applications, NeverLate proactively surfaces:

> "Your flight is in 3 days. Your passport renewal is still incomplete. You also have a conflicting meeting during airport transit time."

The goal isn't better reminders.

The goal is preventing problems before they happen.

## 🎬 Demo Scenario

Sarah is traveling to Canada next week.

NeverLate discovers:

- an unread flight confirmation email
- a missing hotel check-in reminder
- a project review meeting scheduled during airport transit
- a passport renewal task still marked incomplete

The AI combines information from multiple sources and proactively surfaces:

> "You have a flight in 4 days, a conflicting meeting during airport transit, and an unfinished passport-related task that may impact travel."

Instead of finding problems after they happen, Sarah resolves them before they become emergencies.

## 🛑 The Problem

Modern life is fragmented across:
- Gmail
- Google Calendar
- Reminders
- To-do lists
- Travel confirmations
- Notifications
- Personal commitments

People spend far too much time manually tracking commitments, cross-referencing calendars against emails, and frequently missing important events because critical information is siloed in disconnected tools.

## 💡 The Solution

NeverLate acts as a unified personal AI agent. By connecting directly to your fragmented data sources, it constantly analyzes your digital footprint to proactively surface:

- Scheduling conflicts
- Upcoming deadlines
- Travel preparation needs
- Forgotten commitments
- Priority actions
- Potential risks

You can interact with NeverLate using natural language:
- *"What am I likely to miss this week?"*
- *"Do I have any travel plans?"*
- *"What needs my attention today?"*
- *"What are my top priorities?"*

The system securely queries your connected sources and instantly produces actionable insights.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 💬 **Conversational Life Assistant** | Ask complex questions about your schedule and get immediate, contextual answers. |
| 🛡️ **Commitment Risk Detection** | Automatically flags double-bookings, tight connections, and unread critical emails. |
| 📊 **Unified Life Command Center** | A stunning command center bringing emails, calendars, and AI insights into a single view. |
| 🔌 **Extensible Data Sources** | Built on MCP to effortlessly pull data from Gmail, Google Calendar, and future integrations. |
| 🌑 **Premium Dark UI** | A gorgeous glassmorphism interface built with TailwindCSS v4 and React 19. |

## 🚶 User Experience Walkthrough

1. **Dashboard:** Start your day with a unified overview of active risks, KPIs, and immediate next steps.
2. **AI Chat:** Chat with your personal agent to generate custom briefings or ask about specific travel plans.
3. **Events & Reminders:** Review beautifully categorized timelines of upcoming meetings and urgent reminders.
4. **Insights:** See data-driven analytics regarding your productivity, time saved, and meeting velocity.
5. **Actions:** Actionable items requiring immediate resolution are aggregated securely in one place.

## 📸 Product Experience

### Dashboard

The Dashboard provides a unified view of risks, priorities, upcoming events, and AI-generated recommendations.

<div align="center">
  <img src="./assets/dashboard-desktop.png" alt="NeverLate Dashboard" width="85%" />
</div>

### AI Chat

Ask natural-language questions and receive contextual answers grounded in connected data sources.

<div align="center">
  <img src="./assets/chat-desktop.png" alt="NeverLate AI Chat Desktop" width="70%" />
  <img src="./assets/chat-mobile.png" alt="NeverLate AI Chat Mobile" width="22%" />
</div>

### Insights

Analyze workload trends, productivity signals, and scheduling patterns.

<div align="center">
  <img src="./assets/insights-desktop.png" alt="NeverLate Insights" width="85%" />
</div>

## 🧠 AI Agent Architecture

Our backend orchestration relies on three interconnected intelligence layers:

### 1. AI Engine
The central orchestration layer responsible for routing user requests, selecting the best reasoning strategy, and coordinating tool execution.

### 2. Heuristic Engine
Handles lightning-fast, deterministic reasoning. It powers the real-time prioritization, conflict detection, deadline analysis, and rule-based insights without relying on costly LLM calls for every computation.

### 3. LLM Engine
Handles natural language understanding (NLU), intent classification, and generates human-readable responses based on the data retrieved by the other engines.

## 🛠️ Why MCP?

Most AI assistants are limited to whatever information is manually pasted into a chat window.

NeverLate uses the Model Context Protocol (MCP) to transform external systems into AI-accessible tools.

This means the AI can:

* query Gmail
* inspect upcoming calendar events
* identify scheduling conflicts
* analyze reminders
* retrieve contextual information

without hardcoding every integration into the reasoning layer.

MCP allows NeverLate to scale from a simple productivity assistant into a true personal life agent.

## ⚡ How It Works

1. **Connect Sources**: Connect your Gmail, Google Calendar, and other tools.
2. **Gather Context**: The AI gathers relevant information from your connected sources using MCP tools.
3. **Detect Conflicts**: The Heuristic Engine analyzes the information to detect potential risks and conflicts.
4. **Generate Insights**: The LLM generates insights based on the detected risks and conflicts.
5. **Recommend Actions**: The LLM recommends actions to resolve the detected risks and conflicts.

## 🏗️ System Architecture

```txt
  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
  │     Gmail     │     │Google Calendar│     │ Future Sources│
  └───────┬───────┘     └───────┬───────┘     └───────┬───────┘
          │                     │                     │
          └──────────────┬──────┴─────────────────────┘
                         ▼
             ┌─────────────────────────┐
             │       MCP Layer         │
             │   (Tool Abstraction)    │
             └───────────┬─────────────┘
                         │
        ┌────────────────▼────────────────┐
        │        NeverLate Backend        │
        │                                 │
        │  ┌─────────┐   ┌─────────────┐  │
        │  │AI Engine│◄─►│Heuristic Eng│  │
        │  └────┬────┘   └─────────────┘  │
        │       │                         │
        │  ┌────▼────┐                    │
        │  │LLM Eng. │                    │
        │  └─────────┘                    │
        └────────────────┬────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
  ┌───────────────┐             ┌───────────────┐
  │   Dashboard   │             │    AI Chat    │
  └───────────────┘             └───────────────┘
  ┌───────────────┐             ┌───────────────┐
  │   Insights    │             │    Actions    │
  └───────────────┘             └───────────────┘
```

## 🔄 AI Reasoning Flow

```txt
User Question
      │
      ▼
 AI Intent Router
      │
      ▼
 MCP Tools
      │
      ▼
 Gmail + Calendar
      │
      ▼
 Heuristic Analysis
      │
      ▼
 LLM Response
      │
      ▼
 Actionable Recommendation
```

## 🗂️ Repository Structure

```text
apps/
├── server/                 # Express backend orchestration
│   ├── ai/                 # Core intelligence layer
│   │   ├── aiEngine.ts     # Request routing & strategy
│   │   ├── heuristicEngine.ts # Deterministic rule processing
│   │   └── llmEngine.ts    # Natural language generation
│   ├── coral-sources/      # External data integrations
│   ├── mcp/                # Model Context Protocol
│   │   ├── registry.ts     # Tool registration
│   │   ├── interfaces.ts   # Typings
│   │   └── tools/          # Discrete MCP tools
│   ├── services/           # Business logic & API wrappers
│   └── utils/              # Shared backend utilities
│
├── web/                    # React frontend application
│   ├── components/         # Reusable UI elements
│   ├── pages/              # Application routes
│   ├── context/            # React state context
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API interaction layer
│   └── data/               # Mock & static data assets
│
packages/                   # Shared monorepo packages
├── ai/                     # Shared AI typings & prompts
└── shared/                 # Common interfaces
```

## 🌍 Why This Matters

People don't miss commitments because they lack calendars.

They miss commitments because context is fragmented.

The challenge isn't storing information.

The challenge is connecting information.

NeverLate helps users understand relationships between emails, events, reminders, and commitments so they can act before problems occur.

## 💻 Tech Stack

**Frontend Stack:**
- React
- TypeScript
- Vite
- Tailwind CSS

**Backend Stack:**
- Node.js
- Express
- TypeScript

**AI & Orchestration:**
- Model Context Protocol (MCP)
- Custom Heuristic & LLM Engines

## 🚀 Getting Started

### Environment Variables
Create a `.env` file in the root directory and configure the necessary parameters.

```env
# Backend Configuration
PORT=3000

# Coral Configuration
CORAL_BASE_URL=http://localhost:8080

# Demo Mode Configuration
# Bypasses Coral execution and returns mock data for testing
MOCK_MODE=true

# Frontend Configuration
VITE_API_URL=http://localhost:3000
VITE_MOCK_MODE=true
```

### Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-org/neverlate.git
cd neverlate

# 2. Install monorepo dependencies
npm install

# 3. Start the development server (runs frontend and backend concurrently)
npm run dev
```

## ☁️ Deployment Architecture

NeverLate is deployed as a modern monorepo with the React frontend hosted on Vercel and the Express AI backend hosted on Render.

```txt
         ┌──────────────────┐
         │     USER UI      │
         └────────┬─────────┘
                  │
      ┌───────────▼───────────┐
      │        VERCEL         │
      │ (React Frontend App)  │
      └───────────┬───────────┘
                  │
      ┌───────────▼───────────┐
      │        RENDER         │
      │ (Node.js/Express API) │
      └───────────┬───────────┘
                  │
      ┌───────────▼───────────┐
      │  CONNECTED SOURCES    │
      │   (Gmail, Calendar)   │
      └───────────────────────┘
```
*Note: Shared packages are securely orchestrated via a monorepo workspace during the build step.*

## 🤖 AI-Assisted Development

Our team leveraged cutting-edge AI tools including **ChatGPT**, **Gemini**, and **Antigravity** to accelerate development during the hackathon. We utilized these tools for:

- Architecture exploration
- Implementation acceleration
- Rapid debugging
- Code review assistance
- Documentation generation

**Transparency Note:** Humans made all final technical decisions, manually validated every implementation, and governed the system architecture. AI was used as a powerful accelerator, but it did not replace our core engineering judgment.

## 🔮 Future Roadmap

- **Extended Data Sources:** Integrate Notion, Slack, Linear, and Jira.
- **Agentic Actions:** Empower the AI not just to read data, but to perform explicit actions (e.g., automatically drafting email replies or rescheduling calendar events).
- **Offline First Support:** Cache essential metadata securely using local SQLite databases.
- **Proactive Push Notifications:** Integrate WebSockets for real-time risk alerts directly to mobile devices.

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/oluwatobiss">
        <img src="https://github.com/oluwatobiss.png" width="80px" alt="Oluwatobi Sofela"/><br/>
        <sub><b>Oluwatobi Sofela</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/GPramodh07">
        <img src="https://github.com/GPramodh07.png" width="80px" alt="Pramodh G"/><br/>
        <sub><b>G Pramodh</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ShazilParwez">
        <img src="https://github.com/ShazilParwez.png" width="80px" alt="Shazil Parwez"/><br/>
        <sub><b>Shazil Parwez</b></sub>
      </a>
    </td>
  </tr>
</table>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the WeMakeDevs Coral Hackathon**

</div>