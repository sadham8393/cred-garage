import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onToggleMode: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleMode }) => (
  <motion.header
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 80, damping: 12 }}
    className="w-full bg-white dark:bg-[#181a20] py-5 shadow-md flex justify-center items-center relative"
  >
    <span className="font-bold text-xl uppercase tracking-widest text-[#181a20] dark:text-white">
      CRED Garage
    </span>
    <motion.button
      whileHover={{ scale: 1.15, rotate: 8 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
      onClick={onToggleMode}
      className="absolute right-8 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-2xl text-[#181a20] dark:text-white transition-colors"
    >
      <FaMoon className="hidden dark:inline" />
      <FaSun className="inline dark:hidden" />
    </motion.button>
  </motion.header>
);

export default DashboardHeader;
