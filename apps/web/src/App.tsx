import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";
import Insights from "./pages/Insights";
import AIChat from "./pages/AIChat";
import Sources from "./pages/Sources";
import Settings from "./pages/Settings";
import Events from "./pages/Events.tsx";
import Reminders from "./pages/Reminders.tsx";
import Actions from "./pages/Actions.tsx";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isDark, setIsDark] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} isDark={isDark} />;
      case "dashboard2":
        return <Dashboard2 setActivePage={setActivePage} isDark={isDark} />;
      case "events":
        return <Events isDark={isDark} />;
      case "reminders":
        return <Reminders isDark={isDark} />;
      case "actions":
        return <Actions isDark={isDark} />;
      case "insights":
        return <Insights isDark={isDark} />;
      case "chat":
        return <AIChat isDark={isDark} />;
      case "sources":
        return <Sources isDark={isDark} />;
      case "settings":
        return <Settings isDark={isDark} />;
      default:
        return <Dashboard setActivePage={setActivePage} isDark={isDark} />;
    }
  };

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans transition-colors duration-300 ${
        isDark ? "bg-[#0a0a0c] text-zinc-300" : "bg-[#f8f9ff] text-slate-800"
      }`}
    >
      <Sidebar activePage={activePage} setActivePage={setActivePage} isDark={isDark} />
      <div className="flex-1 flex flex-col min-w-0 pl-64">
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          isDark={isDark}
          setIsDark={setIsDark}
        />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}
export { App };
