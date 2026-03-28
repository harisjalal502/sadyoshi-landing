"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Tear {
  id: number
  x: number
  delay: number
  duration: number
  size: number
}

export function FloatingTears() {
  const [tears, setTears] = useState<Tear[]>([])

  useEffect(() => {
    const newTears: Tear[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 4 + Math.random() * 8,
    }))
    setTears(newTears)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {tears.map((tear) => (
        <motion.div
          key={tear.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            left: `${tear.x}%`,
            width: tear.size,
            height: tear.size * 1.5,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          }}
          initial={{ top: "-5%", opacity: 0 }}
          animate={{
            top: "105%",
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: tear.duration,
            delay: tear.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
