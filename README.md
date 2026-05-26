# NeverLate

`NeverLate` is a React-based productivity dashboard built with Vite, TypeScript, and Tailwind CSS. It presents a polished UI for a personal AI assistant experience, with mock chat, insight summaries, connected sources, and personalization settings.

## Key Features

- **Dashboard**: KPI cards, top insights, connected source previews, and agenda items.
- **AI Chat**: sample conversation flow, typed messages, AI replies, and prompt chips.
- **Insights**: risk velocity, priority counters, active risk list, and recommendations.
- **Sources**: manage connected source cards and toggles for sync state.
- **Settings**: privacy controls, AI tone, notification preferences, and personalization.
- **Theme support**: light and dark mode across the app.

## Project Structure

- `src/App.tsx` — main shell, page routing, and theme state.
- `src/components/Sidebar.tsx` — navigation sidebar.
- `src/components/Header.tsx` — top header with search and theme toggle.
- `src/pages/` — dashboard, AI chat, insights, sources, and settings pages.
- `src/data/mockData.ts` — mock data powering the UI.

## Getting Started

### Install dependencies

```bash
cd my-app
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Notes

- This is a frontend UI prototype and does not connect to external AI services.
- Chat messages, source connections, and insights are mocked using client-side data.
- Built with React 19, Vite, TypeScript, and Tailwind CSS.
