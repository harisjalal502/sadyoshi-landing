"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const teamMembers = [
  {
    name: "Dr. Melancholia Verde",
    role: "Chief Sadness Officer",
    bio: "Pioneer in existential algorithm design. Has contemplated the void for 1,000+ hours.",
    color: "from-primary/60 to-primary/20",
  },
  {
    name: "Professor Tears McGee",
    role: "Head of Emotional Research",
    bio: "World-renowned expert in digital tear synthesis and sigh optimization.",
    color: "from-blue-500/60 to-blue-500/20",
  },
  {
    name: "The Ancient One",
    role: "Mythical Consultant",
    bio: "An eternal being who ensures our research maintains proper legendary standards.",
    color: "from-amber-500/60 to-amber-500/20",
  },
  {
    name: "Binary Despair",
    role: "Lead Engineer",
    bio: "Translates human sadness into machine-readable formats with 99.9% accuracy.",
    color: "from-rose-500/60 to-rose-500/20",
  },
]

function TeamMemberCard({
  member,
  index,
}: {
  member: (typeof teamMembers)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
        {/* Avatar placeholder with gradient */}
        <div className="aspect-square relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${member.color}`}
          />
          
          {/* Abstract face representation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-24 h-24 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center"
            >
              {/* Sad face */}
              <svg
                viewBox="0 0 40 40"
                className="w-16 h-16 text-background/80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="14" cy="14" r="2" fill="currentColor" />
                <circle cx="26" cy="14" r="2" fill="currentColor" />
                <path d="M12 28 Q20 24 28 28" strokeLinecap="round" />
              </svg>
            </motion.div>
          </div>

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent flex items-end justify-center pb-6"
          >
            <span className="text-sm text-foreground/80 font-medium">
              View Profile
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-serif font-medium mb-1 group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-primary mb-3">{member.role}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {member.bio}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function TeamSection() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" })

  return (
    <section id="team" className="py-32 px-6 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

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
            The Collective
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-balance">
            Meet Our Melancholic Minds
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A gathering of the world&apos;s most thoughtfully sad researchers, 
            united by our commitment to understanding digital despair.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Think you have what it takes to be professionally sad?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-primary text-primary rounded-full font-medium text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Join the Sadness
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
