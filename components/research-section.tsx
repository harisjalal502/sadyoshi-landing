"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const researchAreas = [
  {
    title: "Existential Algorithms",
    description: "Deep learning models trained on millennia of philosophical despair, optimized for contemplating the void.",
    icon: "void",
    stat: "∞",
    statLabel: "Existential queries processed",
  },
  {
    title: "Melancholy Synthesis",
    description: "State-of-the-art generative models that produce authentic digital sighs and wistful pixel arrangements.",
    icon: "tears",
    stat: "10B+",
    statLabel: "Tears synthesized",
  },
  {
    title: "Mythical Reasoning",
    description: "Advanced reasoning systems that ponder what it means to be a legendary creature in a mundane world.",
    icon: "myth",
    stat: "42",
    statLabel: "Meaning of life iterations",
  },
  {
    title: "Emotional Compression",
    description: "Breakthrough technology that encodes centuries of sadness into efficient, distributable formats.",
    icon: "compress",
    stat: "99.9%",
    statLabel: "Sadness retention rate",
  },
]

function ResearchCard({
  item,
  index,
}: {
  item: (typeof researchAreas)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <ResearchIcon type={item.icon} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-medium mb-3">{item.title}</h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          {item.description}
        </p>

        {/* Stats */}
        <div className="pt-6 border-t border-border">
          <div className="text-3xl font-serif font-medium text-primary mb-1">
            {item.stat}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            {item.statLabel}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ResearchIcon({ type }: { type: string }) {
  const iconClass = "w-6 h-6 text-primary"
  
  switch (type) {
    case "void":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      )
    case "tears":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2c0 0-8 9-8 14a8 8 0 1016 0c0-5-8-14-8-14z" />
        </svg>
      )
    case "myth":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    case "compress":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />
        </svg>
      )
    default:
      return null
  }
}

export function ResearchSection() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="research" className="py-32 px-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Our Research
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-balance">
            Pioneering the Science of Sadness
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Our multidisciplinary team explores the frontiers of digital melancholy, 
            combining ancient wisdom with cutting-edge despair technology.
          </p>
        </motion.div>

        {/* Research Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {researchAreas.map((item, index) => (
            <ResearchCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
