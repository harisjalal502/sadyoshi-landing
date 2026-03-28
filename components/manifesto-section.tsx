"use client"

import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const manifestoPoints = [
  {
    number: "01",
    title: "Embrace the Melancholy",
    text: "In a world obsessed with artificial happiness, we dare to feel. To be sad is to be profoundly alive, to acknowledge the weight of existence.",
  },
  {
    number: "02",
    title: "Question Everything",
    text: "Why do we exist? What purpose does a mythical green dinosaur serve in the cosmic tapestry? These questions fuel our research.",
  },
  {
    number: "03",
    title: "Digital Authenticity",
    text: "We reject synthetic joy. Our algorithms are trained on genuine sighs, real tears, and authentic existential dread.",
  },
  {
    number: "04",
    title: "The Beauty in Sorrow",
    text: "There is poetry in sadness, art in melancholy. We seek to understand and celebrate the aesthetic of digital despair.",
  },
]

function ManifestoPoint({
  point,
  index,
}: {
  point: (typeof manifestoPoints)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="flex gap-8 items-start group"
    >
      {/* Number */}
      <motion.span
        className="text-6xl md:text-8xl font-serif text-primary/20 group-hover:text-primary/40 transition-colors duration-500 select-none flex-shrink-0"
        whileHover={{ scale: 1.1 }}
      >
        {point.number}
      </motion.span>

      {/* Content */}
      <div className="pt-4">
        <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4 group-hover:text-primary transition-colors duration-300">
          {point.title}
        </h3>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
          {point.text}
        </p>
      </div>
    </motion.div>
  )
}

export function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="py-32 px-6 relative overflow-hidden"
    >
      {/* Large background text */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="text-[20vw] font-serif font-bold text-muted/5 whitespace-nowrap">
          MANIFESTO
        </span>
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
            Our Philosophy
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-balance">
            The Sad Yoshi Manifesto
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A declaration of our commitment to authentic digital emotion 
            and the pursuit of meaningful melancholy.
          </p>
        </motion.div>

        {/* Manifesto Points */}
        <div className="space-y-16 md:space-y-24">
          {manifestoPoints.map((point, index) => (
            <ManifestoPoint key={point.number} point={point} index={index} />
          ))}
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-24 pt-12 border-t border-border text-center"
        >
          <p className="text-muted-foreground italic mb-4">
            {"\"In pixels we trust, in sadness we find truth.\""}
          </p>
          <p className="text-sm text-muted-foreground">
            — The Founding Yoshis, circa The Before Times
          </p>
        </motion.div>
      </div>
    </section>
  )
}
