import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";

export interface Benefit {
  title: string;
  icon: React.ReactNode;
  description: string;
  cta: string;
}

interface BenefitsSectionProps {
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
  onCTAClick: (benefit: Benefit) => void;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  benefits,
  loading,
  error,
  onCTAClick,
}) => {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-6 justify-center my-8 w-full">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl shadow-md p-6 min-w-[220px] max-w-[260px] flex flex-col items-center bg-white dark:bg-[#23242a] animate-pulse opacity-70"
          >
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-8 w-full">
        <div className="text-red-500 dark:text-red-400 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  if (!benefits || !benefits.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center my-8">
      {benefits.map((benefit, idx) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-40px" });
        return (
          <motion.div
            key={idx}
            ref={ref}
            className="rounded-2xl shadow-md p-6 min-w-[220px] max-w-[260px] flex flex-col items-center transition-transform duration-200 cursor-pointer bg-white dark:bg-[#23242a] hover:scale-[1.03] hover:shadow-xl dark:hover:shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              delay: idx * 0.12,
              duration: 0.5,
              type: "spring",
              stiffness: 80,
              damping: 14,
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCTAClick(benefit)}
          >
            <div className="text-3xl mb-2 text-[#00e6a8] dark:text-[#00e6a8]">{benefit.icon}</div>
            <div className="text-lg font-semibold mb-1 text-[#181a20] dark:text-white">
              {benefit.title}
            </div>
            <div className="text-base text-center mb-4 text-gray-500 dark:text-[#b0b3c6]">
              {benefit.description}
            </div>
            <Button
              variant="default"
              className="bg-gradient-to-r from-[#00e6a8] to-[#00b2ff] text-white rounded-lg px-5 py-2 font-medium text-base transition-colors duration-200 hover:from-[#00b2ff] hover:to-[#00e6a8] dark:from-[#00e6a8] dark:to-[#00b2ff] dark:text-white"
              tabIndex={-1}
            >
              {benefit.cta}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default BenefitsSection;
