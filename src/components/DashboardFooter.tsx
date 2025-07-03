import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DashboardFooter: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.footer
      ref={ref}
      initial={{ y: 40, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
      className="w-full text-center py-4 text-base border-t bg-white text-[#888] border-[#e0e0e0] dark:bg-[#181a20] dark:text-[#b0b3c6] dark:border-[#23242a]"
    >
      © {new Date().getFullYear()} CRED Garage Inspired Dashboard. All rights reserved.
    </motion.footer>
  );
};

export default DashboardFooter;
