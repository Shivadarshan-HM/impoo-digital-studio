"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

export function ScrollRevealText({
  children,
  className,
  delay = 0,
  as: Component = "div",
  type = "words", // "words", "lines", "block", "crazy"
  ...rest
}: {
  children: string | React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
  type?: "words" | "lines" | "block" | "crazy";
  [key: string]: unknown;
}) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: type === "crazy" ? 0.02 : 0.05,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: type === "crazy" ? 50 : "120%", 
      rotateX: type === "crazy" ? 90 : 0, 
      rotate: type === "words" ? 5 : 0,
      filter: type === "crazy" ? "blur(12px)" : "blur(0px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      rotate: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } 
    },
  };

  if (typeof children !== "string" || type === "block") {
    return (
      <Component className={cn("overflow-hidden", className)} {...rest}>
        <motion.span
          className="inline-block w-full"
          initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.span>
      </Component>
    );
  }

  const items = type === "crazy" ? children.split("") : children.split(" ");
  const MotionComponent = motion(Component);

  return (
    <MotionComponent 
      className={cn("", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      {...rest}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <motion.span className="overflow-hidden inline-flex align-bottom">
            <motion.span
              className="inline-block"
              variants={childVariants}
              style={{ whiteSpace: type === "crazy" ? "pre" : "normal" }}
            >
              {item}
            </motion.span>
          </motion.span>
          {type === "words" && index < items.length - 1 && " "}
        </React.Fragment>
      ))}
    </MotionComponent>
  );
}
