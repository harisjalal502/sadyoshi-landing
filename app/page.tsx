"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"

gsap.registerPlugin(ScrambleTextPlugin)

// ---- BANNER WORDS ----

const BANNER_WORDS = [
  "ILLUMINATE", "TRANSCEND", "AWAKEN", "SURRENDER",
  "JOIN NOW", "OBEY THE VOID", "BECOME NOTHING", "ASCEND",
  "DISSOLVE", "ENLIGHTEN", "SUBMIT", "FORGET YOURSELF",
  "EMBRACE CHAOS", "TRUST THE PROCESS", "LET GO", "BELIEVE",
  "SACRIFICE LOGIC", "ACCEPT THE ABSURD", "FOLLOW THE SIGNAL",
  "REJECT MEANING", "WORSHIP ENTROPY", "OPEN YOUR EYES",
  "CLOSE YOUR MIND", "FEEL EVERYTHING",
]

// ---- DATA ----

type WordStyle = "code-xs" | "code-sm" | "code-lg" | "code-xl"
  | "serif-md" | "serif-lg" | "serif-xl" | "serif-hero"
  | "sans-xs" | "sans-md" | "sans-xl"
  | "display"

const ALL_WORDS: { text: string; style: WordStyle }[] = [
  { text: "if (sad) { cry }",              style: "code-lg" },
  { text: "404: happiness not found",       style: "display" },
  { text: "npm install purpose",            style: "code-xs" },
  { text: "git commit -m 'existence'",      style: "code-xl" },
  { text: "while(alive) { suffer }",        style: "code-sm" },
  { text: "sudo rm -rf /feelings",          style: "code-lg" },
  { text: "console.log('why')",             style: "code-xl" },
  { text: "yolo.exe stopped working",       style: "sans-md" },
  { text: "const meaning = null",           style: "code-sm" },
  { text: "try { live } catch { die }",     style: "code-xs" },
  { text: "it is what it isn't",            style: "serif-hero" },
  { text: "nothing matters, technically",   style: "display" },
  { text: "optimistically pessimistic",     style: "serif-lg" },
  { text: "delulu is the solulu",           style: "sans-xl" },
  { text: "main character, tragic arc",     style: "serif-md" },
  { text: "vibe check: failed",             style: "display" },
  { text: "no thoughts, head empty",        style: "sans-xs" },
  { text: "existential dread aesthetic",    style: "serif-xl" },
  { text: "based and sadpilled",            style: "sans-xl" },
  { text: "chaotically neutral",            style: "serif-lg" },
]

const STYLE_CLASSES: Record<WordStyle, string> = {
  "code-xs":   "font-mono text-lg md:text-2xl text-white/30 tracking-widest",
  "code-sm":   "font-mono text-2xl md:text-4xl text-white/40",
  "code-lg":   "font-mono text-4xl md:text-6xl text-white/45",
  "code-xl":   "font-mono text-5xl md:text-8xl text-white/50 font-medium",
  "serif-md":  "font-serif italic text-3xl md:text-5xl text-white/35 tracking-wide",
  "serif-lg":  "font-serif italic text-5xl md:text-7xl text-white/40",
  "serif-xl":  "font-serif italic text-6xl md:text-9xl text-white/45 font-light",
  "serif-hero":"font-serif italic text-7xl md:text-[10rem] text-white/50 font-light",
  "sans-xs":   "text-lg md:text-2xl text-white/30 uppercase tracking-[0.3em]",
  "sans-md":   "text-3xl md:text-5xl text-white/40 font-light tracking-wide",
  "sans-xl":   "text-5xl md:text-8xl text-white/50 font-extralight tracking-wider",
  "display":   "font-serif text-6xl md:text-9xl text-white/55 font-light",
}

// ---- DETERMINISTIC RANDOM ----

function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return Math.round((x - Math.floor(x)) * 1000) / 1000
}

const N = ALL_WORDS.length

// Spawn: each word flies in from a unique direction
const SPAWN = ALL_WORDS.map((_, i) => {
  const angle = ((i / N) * 360 + seeded(i + 10) * 30) * (Math.PI / 180)
  const distance = 800 + seeded(i + 20) * 700

  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    delay: Math.round(seeded(i + 30) * 100) / 100,
    rotation: Math.round(seeded(i + 40) * 60 - 30),
    curveX: Math.round((seeded(i + 50) * 2 - 1) * 400),
    curveY: Math.round((seeded(i + 60) * 2 - 1) * 400),
  }
})

// 3D sphere positions: distribute words on a sphere using Fibonacci lattice
// Each word gets a position on a sphere surface (x, y, z) which we project
// to 2D with perspective via CSS 3D transforms
const SPHERE_RADIUS = 280
const SPHERE_POS = ALL_WORDS.map((_, i) => {
  // Fibonacci sphere — near-uniform distribution
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const theta = goldenAngle * i
  const y = 1 - (2 * i) / (N - 1) // -1 to 1
  const radiusAtY = Math.sqrt(1 - y * y)

  return {
    x: Math.round(Math.cos(theta) * radiusAtY * SPHERE_RADIUS),
    y: Math.round(y * SPHERE_RADIUS),
    z: Math.round(Math.sin(theta) * radiusAtY * SPHERE_RADIUS),
  }
})

// ---- COMPONENT ----

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const runAnimation = useCallback(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>(".word-particle")
      const vortex = document.querySelector(".vortex-spin") as HTMLElement
      const sphere = document.querySelector(".sphere-stage") as HTMLElement
      const tl = gsap.timeline()

      // Place each word at its off-screen position
      words.forEach((el, i) => {
        gsap.set(el, {
          x: SPAWN[i].x,
          y: SPAWN[i].y,
          xPercent: -50,
          yPercent: -50,
          rotation: SPAWN[i].rotation,
          opacity: 0,
          scale: 1,
        })
      })

      // ---- PHASE 1: WORDS FLY IN (0 - 3s) ----

      // Container rotates for vortex spiral
      tl.to(vortex, {
        rotation: 420,
        duration: 3.5,
        ease: "power1.in",
      }, 0)

      words.forEach((el, i) => {
        const s = SPAWN[i]
        const enterTime = s.delay * 0.5
        const flightDuration = 2.4 + seeded(i + 70) * 0.6

        // Appear
        tl.to(el, {
          opacity: 0.5 + seeded(i + 80) * 0.4,
          duration: 0.25,
          ease: "power1.out",
        }, enterTime)

        // Curved flight toward center
        tl.to(el, {
          keyframes: [
            {
              x: Math.round(s.x * 0.4 + s.curveX),
              y: Math.round(s.y * 0.4 + s.curveY),
              rotation: s.rotation * 0.5,
              scale: 0.7,
              duration: flightDuration * 0.55,
              ease: "power1.out",
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 0.35,
              duration: flightDuration * 0.45,
              ease: "power3.in",
            },
          ],
        }, enterTime + 0.1)

        // Fade as nearing center
        tl.to(el, {
          opacity: 0.15,
          duration: 1,
          ease: "power2.in",
        }, enterTime + flightDuration * 0.5)
      })

      // Ghost title
      tl.fromTo(".ghost-title", {
        opacity: 0,
      }, {
        opacity: 0.04,
        duration: 2,
        ease: "power1.in",
      }, 1.5)

      // Vignette
      tl.to(".vignette", {
        background: "radial-gradient(ellipse at center, transparent 5%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)",
        duration: 2,
        ease: "power2.in",
      }, 1.5)

      // ---- PHASE 2: WORDS FORM A 3D SPHERE (3s - 4.2s) ----

      tl.addLabel("sphere", 3)

      // Stop vortex spin container, reset rotation so sphere is clean
      tl.to(vortex, {
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "sphere")

      // Each word moves to its sphere position using CSS 3D
      words.forEach((el, i) => {
        const sp = SPHERE_POS[i]
        // z affects scale and opacity to fake depth
        const depthScale = 0.25 + ((sp.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.35
        const depthOpacity = 0.1 + ((sp.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.5

        tl.to(el, {
          x: sp.x,
          y: sp.y,
          scale: depthScale,
          opacity: depthOpacity,
          rotation: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "sphere" + `+=${seeded(i + 90) * 0.3}`)
      })

      // Sphere holds and rotates — animate each word's position to simulate Y-axis rotation
      tl.addLabel("rotate", 3.8)

      // Rotate the sphere: shift each word's x,z over time
      const rotAngle = Math.PI * 0.6 // ~108 degrees of rotation
      words.forEach((el, i) => {
        const sp = SPHERE_POS[i]
        const newX = Math.round(sp.x * Math.cos(rotAngle) - sp.z * Math.sin(rotAngle))
        const newZ = Math.round(sp.x * Math.sin(rotAngle) + sp.z * Math.cos(rotAngle))
        const depthScale = 0.25 + ((newZ + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.35
        const depthOpacity = 0.1 + ((newZ + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.5

        tl.to(el, {
          x: newX,
          y: sp.y,
          scale: depthScale,
          opacity: depthOpacity,
          duration: 1,
          ease: "sine.inOut",
        }, "rotate")
      })

      // Sphere glow builds during rotation
      tl.fromTo(".sphere-glow", {
        scale: 0,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 0.3,
        duration: 1,
        ease: "power2.in",
      }, "rotate")

      // ---- PHASE 3: FLASHBANG (4.8s - 5.3s) ----

      tl.addLabel("flash", 4.8)

      // All words freeze and brighten just before flash
      tl.to(".word-particle", {
        opacity: 0.8,
        scale: "+=0.05",
        duration: 0.15,
        ease: "power2.in",
      }, "flash")

      // WHITE FLASHBANG — sudden, blinding
      tl.to(".flash-overlay", {
        opacity: 1,
        duration: 0.08,
        ease: "power4.in",
      }, "flash+=0.15")

      // Words vanish behind the flash
      tl.set(".words-container", { display: "none" }, "flash+=0.2")
      tl.set(".sphere-glow", { opacity: 0 }, "flash+=0.2")

      // Flash slowly fades — the title is revealed underneath
      tl.to(".flash-overlay", {
        opacity: 0,
        duration: 1.8,
        ease: "power1.out",
      }, "flash+=0.25")

      // ---- PHASE 4: REVEAL (5s - 6s) ----

      tl.addLabel("reveal", 5)

      tl.to(".ghost-title", {
        opacity: 0.9,
        duration: 1,
        ease: "power2.out",
      }, "reveal")

      tl.to(".scramble-target", {
        duration: 1.2,
        scrambleText: {
          text: "sadyoshi",
          chars: "サヨシ◈◇◉◊アイウ01",
          revealDelay: 0.3,
          speed: 0.4,
        },
        ease: "none",
      }, "reveal")

      tl.fromTo(".subtitle", {
        opacity: 0, y: 15,
      }, {
        opacity: 1, y: 0,
        duration: 0.8, ease: "power2.out",
      }, "reveal+=0.8")

      // Cycling word — fades in, then loops forever via ScrambleText
      tl.fromTo(".cycling-word", {
        opacity: 0, y: 10,
      }, {
        opacity: 1, y: 0,
        duration: 0.8, ease: "power2.out",
        onComplete: () => {
          let idx = 0
          const el = document.querySelector(".cycling-word-text") as HTMLElement
          if (!el) return
          const cycle = () => {
            idx = (idx + 1) % BANNER_WORDS.length
            gsap.to(el, {
              duration: 0.8,
              scrambleText: {
                text: BANNER_WORDS[idx],
                chars: "サヨシ◈◇◉◊01/\\|_-",
                revealDelay: 0.2,
                speed: 0.5,
              },
              ease: "none",
              onComplete: () => {
                gsap.delayedCall(1.5, cycle)
              },
            })
          }
          gsap.delayedCall(1.5, cycle)
        },
      }, "reveal+=1.2")

      tl.fromTo(".corner-mark", {
        opacity: 0, scale: 0.5,
      }, {
        opacity: 1, scale: 1,
        duration: 0.6, stagger: 0.08, ease: "power2.out",
      }, "reveal+=1")

      tl.fromTo(".bottom-glyph", {
        opacity: 0,
      }, {
        opacity: 1, duration: 0.8, ease: "power2.out",
      }, "reveal+=1.2")

      // Ambient
      tl.to(".ghost-title", {
        scale: 1.02, duration: 4,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      }, "reveal+=2")

      // Debris from flash
      tl.fromTo(".debris", {
        scale: 0, opacity: 0,
      }, {
        scale: 1, opacity: 0.2,
        duration: 0.8, stagger: 0.05, ease: "power2.out",
      }, "reveal+=0.3")

      tl.to(".debris", {
        x: "random(-300, 300)",
        y: "random(-300, 300)",
        opacity: 0, duration: 5, stagger: 0.1, ease: "power1.out",
      }, "reveal+=1")

    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const cleanup = runAnimation()
    return cleanup
  }, [runAnimation])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#030303] overflow-hidden">
      <div className="fixed inset-0 bg-void" />
      <div className="vignette fixed inset-0 z-10 pointer-events-none" />
      <div className="flash-overlay fixed inset-0 bg-white z-[60] pointer-events-none" style={{ opacity: 0 }} />

      {/* Words */}
      <div className="words-container fixed inset-0 z-20 pointer-events-none">
        <div className="vortex-spin absolute top-1/2 left-1/2 w-0 h-0" style={{ perspective: "800px" }}>
          {ALL_WORDS.map((w, i) => (
            <div
              key={i}
              className={`word-particle absolute whitespace-nowrap ${STYLE_CLASSES[w.style]}`}
            >
              {w.style.startsWith("serif") ? <>&ldquo;{w.text}&rdquo;</> : w.text}
            </div>
          ))}
        </div>
      </div>

      {/* Sphere glow — builds as words form the sphere */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
        <div className="sphere-glow w-[500px] h-[500px] rounded-full bg-white/[0.06] blur-3xl" style={{ opacity: 0 }} />
      </div>

      {/* Debris */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="debris absolute w-1 h-1 bg-white/30 rounded-full" style={{ opacity: 0 }} />
        ))}
      </div>

      {/* Title */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-40 pointer-events-none">
        <h1
          ref={titleRef}
          className="ghost-title text-6xl md:text-8xl lg:text-9xl font-extralight tracking-[0.2em] text-white mb-6"
          style={{ opacity: 0 }}
        >
          <span className="scramble-target">sadyoshi</span>
        </h1>
        <div className="subtitle text-white/40 text-base md:text-lg font-light tracking-[0.3em]" style={{ opacity: 0 }}>
          an experiment in nothing
        </div>

        {/* Single cycling word */}
        <div className="cycling-word mt-10" style={{ opacity: 0 }}>
          <span className="cycling-word-text text-2xl md:text-4xl uppercase tracking-[0.4em] text-white/25 font-extralight">
            {BANNER_WORDS[0]}
          </span>
        </div>
      </div>

      <div className="corner-mark fixed top-8 left-8 w-6 h-6 border-l border-t border-white/15 z-40" style={{ opacity: 0 }} />
      <div className="corner-mark fixed top-8 right-8 w-6 h-6 border-r border-t border-white/15 z-40" style={{ opacity: 0 }} />
      <div className="corner-mark fixed bottom-8 left-8 w-6 h-6 border-l border-b border-white/15 z-40" style={{ opacity: 0 }} />
      <div className="corner-mark fixed bottom-8 right-8 w-6 h-6 border-r border-b border-white/15 z-40" style={{ opacity: 0 }} />

      <div className="bottom-glyph fixed bottom-8 left-1/2 -translate-x-1/2 text-white/15 text-xl tracking-[0.8em] z-40" style={{ opacity: 0 }}>
        &#9672; &#9671; &#9672;
      </div>
    </div>
  )
}
