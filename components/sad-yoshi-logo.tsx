"use client"

import { motion } from "framer-motion"

interface SadYoshiLogoProps {
  className?: string
}

export function SadYoshiLogo({ className = "" }: SadYoshiLogoProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Main head shape */}
        <motion.ellipse
          cx="50"
          cy="55"
          rx="35"
          ry="30"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        {/* Snout/nose area */}
        <motion.ellipse
          cx="50"
          cy="68"
          rx="22"
          ry="15"
          className="fill-primary/80"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        
        {/* Left eye (sad, droopy) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ellipse
            cx="38"
            cy="48"
            rx="8"
            ry="10"
            className="fill-background"
          />
          <ellipse
            cx="38"
            cy="50"
            rx="4"
            ry="5"
            className="fill-foreground"
          />
          {/* Sad eyebrow */}
          <path
            d="M30 40 Q38 44 46 42"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-foreground/60"
          />
        </motion.g>
        
        {/* Right eye (sad, droopy) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ellipse
            cx="62"
            cy="48"
            rx="8"
            ry="10"
            className="fill-background"
          />
          <ellipse
            cx="62"
            cy="50"
            rx="4"
            ry="5"
            className="fill-foreground"
          />
          {/* Sad eyebrow */}
          <path
            d="M54 42 Q62 44 70 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-foreground/60"
          />
        </motion.g>
        
        {/* Sad mouth */}
        <motion.path
          d="M40 72 Q50 68 60 72"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          className="text-foreground/80"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />
        
        {/* Nostrils */}
        <circle cx="45" cy="65" r="2" className="fill-primary/50" />
        <circle cx="55" cy="65" r="2" className="fill-primary/50" />
        
        {/* Tear drop - animated */}
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-5, 0, 15, 25] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeIn",
          }}
        >
          <path
            d="M36 56 Q34 62 36 66 Q38 62 36 56"
            className="fill-blue-400/80"
          />
        </motion.g>
        
        {/* Head crest/spikes */}
        <motion.g
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ellipse cx="35" cy="28" rx="8" ry="12" className="fill-primary" />
          <ellipse cx="50" cy="25" rx="8" ry="14" className="fill-primary" />
          <ellipse cx="65" cy="28" rx="8" ry="12" className="fill-primary" />
        </motion.g>
      </svg>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 blur-2xl opacity-30">
        <div className="w-full h-full rounded-full bg-primary" />
      </div>
    </motion.div>
  )
}
