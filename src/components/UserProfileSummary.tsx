import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { userStore } from "../store/userStore";

const UserProfileSummary: React.FC = () => {
  const { user, loading, error, fetchUser } = userStore();

  useEffect(() => {
    setTimeout(() => {
      fetchUser();
    }, 1500);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl bg-[#fff] dark:bg-[#181a20] shadow-xl p-0 w-full max-w-xs mx-auto flex flex-col items-center border-2 border-[#e5e7eb] dark:border-[#23242a]"
      >
        <div className="w-full h-24 bg-gradient-to-r from-[#e5e7eb] to-[#f3f4f6] dark:from-[#23242a] dark:to-[#181a20] rounded-t-3xl flex items-end justify-center relative shadow-md animate-pulse" />
        <div className="flex flex-col items-center pt-14 pb-8 px-8 w-full space-y-2">
          <div className="w-20 h-20 rounded-full bg-[#e5e7eb] dark:bg-[#23242a] border-4 border-white dark:border-[#23242a] shadow-lg absolute -mt-10 animate-pulse" />
          <div className="w-24 h-6 bg-[#e5e7eb] dark:bg-[#23242a] rounded mb-2 mt-12 animate-pulse" />
          <div className="w-12 h-4 bg-[#e5e7eb] dark:bg-[#23242a] rounded mb-2 animate-pulse" />
          <div className="w-full rounded h-2 my-3 bg-[#e5e7eb] dark:bg-[#23242a] animate-pulse" />
          <div className="w-20 h-4 bg-[#e5e7eb] dark:bg-[#23242a] rounded mt-2 animate-pulse" />
        </div>
      </motion.div>
    );
  }

  if (error || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="rounded-3xl bg-[#fff] dark:bg-[#181a20] shadow-xl p-0 w-full max-w-xs mx-auto flex flex-col items-center border-2 border-[#e5e7eb] dark:border-[#23242a]"
      >
        <div className="py-16 text-red-500">{error || "User not found"}</div>
      </motion.div>
    );
  }

  const progress = Math.min((user.xp / user.xpMax) * 100, 100);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-3xl bg-[#fff] dark:bg-[#181a20] shadow-xl hover:shadow-2xl transition-shadow p-0 w-full max-w-xs mx-auto flex flex-col items-center border-2 border-[#e5e7eb] dark:border-[#23242a] space-y-0 sm:space-y-2 md:space-y-4"
    >
      <div className="w-full h-24 bg-gradient-to-r from-[#00e6a8] to-[#00b2ff] rounded-t-3xl flex items-end justify-center relative shadow-md">
        <motion.img
          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-[#23242a] shadow-lg absolute -bottom-10"
          src={user.avatarUrl}
          alt="avatar"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 120 }}
        />
      </div>
      <div className="flex flex-col items-center pt-14 pb-8 px-8 w-full space-y-2">
        <div className="text-lg font-bold text-[#333] dark:text-[#fff] mt-1">{user.name}</div>
        <div className="text-xs text-[#b0b3c6] dark:text-[#b0b3c6] bg-[#f2f2f2] dark:bg-[#23242a] rounded px-2 py-0.5 ml-1 border border-gray-200 dark:border-[#23242a]">
          Lvl {user.level}
        </div>
        <motion.div
          className="w-full rounded h-2 my-3 overflow-hidden border bg-[#f2f2f2] dark:bg-[#23242a] border-[#f3f4f6] dark:border-[#23242a]"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#00e6a8] to-[#00b2ff] h-full rounded"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            style={{ minWidth: 0 }}
          />
        </motion.div>
        <span className="text-xs text-[#888] dark:text-[#b0b3c6] mt-1">
          {user.xp} / {user.xpMax} XP
        </span>
      </div>
    </motion.div>
  );
};

export default UserProfileSummary;
