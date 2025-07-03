import React, { useEffect } from "react";
import type { ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { rewardsStore } from "../store/rewardsStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const RewardPointsProgress: React.FC = () => {
  const {
    xp: { points, maxPoints },
    loading,
    error,
    fetchPoints,
  } = rewardsStore();

  useEffect(() => {
    setTimeout(() => {
      fetchPoints();
    }, 1000);
  }, []);

  const data = {
    labels: ["Points", "Remaining"],
    datasets: [
      {
        data: [points, Math.max(maxPoints - points, 0)],
        backgroundColor: ["#00e6a8", "#e5e7eb"],
        borderWidth: 0,
        hoverBackgroundColor: ["#00b2ff", "#e5e7eb"],
        cutout: "75%",
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: "easeOutQuart",
    },
    hover: {
      mode: "nearest" as const,
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl bg-[#fff] dark:bg-[#181a20] shadow-xl hover:shadow-2xl transition-shadow p-0 w-full max-w-xs mx-auto p-6 flex flex-col items-center border-2 border-[#e5e7eb] dark:border-[#23242a] space-y-0 sm:space-y-2 md:space-y-4"
      >
        <div className="relative w-[240px] h-[240px] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-r from-[#e5e7eb] to-[#f3f4f6] dark:from-[#23242a] dark:to-[#181a20] animate-pulse" />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <div className="w-16 h-6 bg-[#e5e7eb] dark:bg-[#23242a] rounded mb-2 animate-pulse" />
            <div className="w-10 h-4 bg-[#e5e7eb] dark:bg-[#23242a] rounded animate-pulse" />
          </div>
        </div>
        <div className="w-32 h-4 bg-[#e5e7eb] dark:bg-[#23242a] rounded mt-4 animate-pulse" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl bg-[#fff] dark:bg-[#181a20] shadow-xl p-0 w-full max-w-xs mx-auto flex flex-col items-center border-2 border-[#e5e7eb] dark:border-[#23242a]"
      >
        <div className="py-16 text-red-500">{error}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl bg-[#fff] dark:bg-[#181a20] shadow-xl hover:shadow-2xl transition-shadow p-0 w-full max-w-xs mx-auto p-6 flex flex-col items-center border-2 border-[#e5e7eb] dark:border-[#23242a] space-y-0 sm:space-y-2 md:space-y-4"
    >
      <div className="relative w-[240px] h-[240px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <span className="text-xl font-bold text-[#181a20] dark:text-[#fff]">{points}</span>
          <span className="text-xs text-[#b0b3c6] dark:text-[#fff]">/ {maxPoints}</span>
        </div>
      </div>
      <div className="text-base text-[#b0b3c6] dark:text-[#fff] mt-1">Reward Points</div>
    </motion.div>
  );
};

export default RewardPointsProgress;
