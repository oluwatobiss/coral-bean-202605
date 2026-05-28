# NeverLate (Coral-Native Edition)

`NeverLate` is a productivity dashboard built with React, TypeScript, and a Node.js backend powered by the **Coral SQL Runtime**. It acts as a personal AI Operating System, querying your connected data sources directly through Coral.

## Architecture

The application operates using a Coral-native architecture:
`Frontend -> NeverLate Backend -> Coral Runtime -> Connected Sources`

Instead of relying on direct Google APIs or managing OAuth tokens manually, NeverLate executes dynamic Coral SQL queries via WSL, bringing all your disconnected sources (Gmail, Calendar, etc.) into a unified runtime.

## Getting Started

### 1. Install WSL and Coral
Ensure you have WSL (Windows Subsystem for Linux) installed.
Install the Coral CLI within your WSL environment.

### 2. Connect Sources
Connect your data sources interactively using the Coral CLI. For example, to connect Gmail:
```bash
wsl -d Ubuntu -e coral source add --interactive --file apps/server/src/coral-sources/gmail/manifest.yaml
```

### 3. Environment Setup
Configure your `.env` file at the root of the project.
```env
PORT=3000
WSL_DISTRO=Ubuntu
```
*Note: `WSL_DISTRO` specifies which WSL environment the backend should use to run Coral commands.*

### 4. Install dependencies

```bash
npm install
```

### 5. Run the Application

```bash
# Start both frontend and backend
npm run dev
```

### 6. Build for production

```bash
npm run build --workspaces
```

## Features
- **Coral SQL Integration:** Queries `gmail.emails` and other sources directly using `coral sql`.
- **Dashboard**: KPI cards, top insights, connected source previews, and agenda items.
- **AI Chat**: Conversation flow, AI replies, and context-aware heuristics.
- **Insights**: Priority counters, active risk list, and recommendations.
- **Fallbacks**: Realistic demo data loads automatically if the Coral runtime is offline or still syncing.
