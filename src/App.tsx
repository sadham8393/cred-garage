import React, { useEffect, useState } from "react";
import UserProfileSummary from "./components/UserProfileSummary";
import BenefitsSection, { type Benefit } from "./components/BenefitsSection";
import { FaGift, FaTag, FaTicketAlt } from "react-icons/fa";
import { Alert } from "./components/ui/alert";
import RewardPointsProgress from "./components/RewardPointsProgress";

import { benefitsStore } from "./store/benefitsStore";
import DashboardHeader from "./components/DashboardHeader";
import DashboardFooter from "./components/DashboardFooter";
import "./index.css";

function App() {
  const { benefits: rawBenefits, loading, error, fetchBenefits } = benefitsStore();

  // Map icon string to actual React component
  const iconMap: Record<string, React.ReactNode> = {
    FaTag: <FaTag />,
    FaTicketAlt: <FaTicketAlt />,
    FaGift: <FaGift />,
  };

  // Replace icon string with React element
  const benefits = rawBenefits.map((b) => ({
    ...b,
    icon: typeof b.icon === "string" && iconMap[b.icon] ? iconMap[b.icon] : b.icon,
  }));

  const [mode, setMode] = useState<"dark" | "light">(() => {
    const stored = localStorage.getItem("theme-mode");
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", mode);
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  useEffect(() => {
    setTimeout(() => {
      fetchBenefits();
    }, 1500);
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);

  const handleBenefitClick = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setDialogOpen(true);
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: mode === "dark" ? "#15171c" : "#f7f8fa",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          transition: "background 0.3s",
        }}
      >
        <DashboardHeader onToggleMode={() => setMode(mode === "dark" ? "light" : "dark")} />
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.5rem",
            padding: "2rem 0",
          }}
        >
          <UserProfileSummary />
          <RewardPointsProgress />
          <BenefitsSection
            benefits={benefits}
            loading={loading}
            error={error}
            onCTAClick={handleBenefitClick}
          />
        </main>
        <DashboardFooter />
      </div>
      {dialogOpen && selectedBenefit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Alert
            variant="info"
            title={selectedBenefit.title}
            description={selectedBenefit.description}
            className="max-w-xs w-full shadow-2xl animate-in fade-in zoom-in rounded-2xl border-2 border-[#e5e7eb] dark:border-[#23242a] bg-white dark:bg-[#181a20]"
          >
            <button
              className="mt-4 ml-auto px-4 py-1.5 rounded bg-primary text-primary-foreground font-semibold text-sm shadow hover:bg-primary/90 transition"
              onClick={() => setDialogOpen(false)}
              autoFocus
            >
              {selectedBenefit.cta}
            </button>
          </Alert>
        </div>
      )}
    </>
  );
}

export default App;
