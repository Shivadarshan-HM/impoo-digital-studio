"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, filter: "blur(20px)", scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)", 
        scale: 1,
        transitionEnd: {
          transform: "none",
          filter: "none"
        }
      }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
