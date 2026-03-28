"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedSection } from "@/components/featured-section"
import { ResearchSection } from "@/components/research-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { TeamSection } from "@/components/team-section"
import { Footer } from "@/components/footer"
import { FloatingTears } from "@/components/floating-tears"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      {/* Ambient floating tears */}
      <FloatingTears />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats & Partners */}
      <FeaturedSection />
      
      {/* Research Areas */}
      <ResearchSection />
      
      {/* Manifesto */}
      <ManifestoSection />
      
      {/* Team */}
      <TeamSection />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
