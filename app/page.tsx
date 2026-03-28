"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import {
  ALL_WORDS, BANNER_WORDS, STYLE_CLASSES,
  SPAWN, SPHERE_POS, SPHERE_RADIUS, seeded, N,
} from "./data/words"

gsap.registerPlugin(ScrambleTextPlugin)

// ---- AMBIENT SOUND ENGINE ----

class AmbientDrone {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private oscs: OscillatorNode[] = []

  start() {
    if (this.ctx) return
    this.ctx = new AudioContext()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(this.ctx.destination)

    const voices: { freq: number; type: OscillatorType; gain: number }[] = [
      { freq: 55, type: "sine", gain: 0.3 },
      { freq: 82.5, type: "sine", gain: 0.15 },
      { freq: 41.2, type: "triangle", gain: 0.2 },
    ]

    voices.forEach(({ freq, type, gain }) => {
      const osc = this.ctx!.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      const g = this.ctx!.createGain()
      g.gain.value = gain
      osc.connect(g)
      g.connect(this.master!)
      osc.start()
      this.oscs.push(osc)
    })

    // LFO for slow frequency drift
    const lfo = this.ctx.createOscillator()
    lfo.type = "sine"
    lfo.frequency.value = 0.08
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 3
    lfo.connect(lfoGain)
    lfoGain.connect(this.oscs[0].frequency)
    lfo.start()
    this.oscs.push(lfo)
  }

  fadeIn() {
    if (!this.ctx || !this.master) return
    this.ctx.resume()
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0.12, now + 2)
  }

  fadeOut() {
    if (!this.ctx || !this.master) return
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 1)
  }

  destroy() {
    this.oscs.forEach((o) => {
      try { o.stop() } catch { /* already stopped */ }
    })
    this.ctx?.close()
    this.ctx = null
  }
}

// ---- ANIMATION HELPERS ----

function startCyclingWord() {
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
      onComplete: () => { gsap.delayedCall(1.5, cycle) },
    })
  }
  gsap.delayedCall(1.5, cycle)
}

function setRevealedState() {
  gsap.set(".words-container", { display: "none" })
  gsap.set(".sphere-glow", { opacity: 0 })
  gsap.set(".flash-overlay", { opacity: 0 })
  gsap.set(".vortex-spin", { rotation: 0 })
  gsap.set(".ghost-title", { opacity: 0.9, scale: 1 })
  gsap.set(".subtitle", { opacity: 1, y: 0 })
  gsap.set(".cycling-word", { opacity: 1, y: 0 })
  gsap.set(".corner-mark", { opacity: 1, scale: 1 })
  gsap.set(".bottom-glyph", { opacity: 1 })
  gsap.set(".debris", { opacity: 0 })
  gsap.set(".vignette", {
    background:
      "radial-gradient(ellipse at center, transparent 5%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)",
  })
}

function startAmbientAnimations() {
  gsap.to(".ghost-title", {
    scale: 1.02,
    duration: 4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  })
  startCyclingWord()
}

// ---- COMPONENT ----

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const droneRef = useRef<AmbientDrone | null>(null)

  const [mounted, setMounted] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ---- SKIP ----

  const skip = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    ctxRef.current?.add(() => {
      setRevealedState()
      startAmbientAnimations()
    })

    const el = document.querySelector(".scramble-target")
    if (el) el.textContent = "sadyoshi"
    setIsRevealed(true)
  }, [])

  // ---- SOUND ----

  const toggleSound = useCallback(() => {
    if (!droneRef.current) {
      droneRef.current = new AmbientDrone()
      droneRef.current.start()
    }
    if (soundOn) {
      droneRef.current.fadeOut()
    } else {
      droneRef.current.fadeIn()
    }
    setSoundOn((s) => !s)
  }, [soundOn])

  useEffect(() => {
    return () => droneRef.current?.destroy()
  }, [])

  // ---- EMAIL ----

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (email.trim()) setSubmitted(true)
    },
    [email],
  )

  // ---- MOUSE PARALLAX + CURSOR GLOW ----

  useEffect(() => {
    if (!isRevealed) return

    const handle = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2

      gsap.to(".cursor-glow", {
        left: e.clientX,
        top: e.clientY,
        duration: 0.8,
        ease: "power2.out",
      })

      gsap.to(".title-group", {
        x: nx * -8,
        y: ny * -8,
        duration: 0.6,
        ease: "power2.out",
      })

      gsap.to(".corner-tl", { x: nx * 12, y: ny * 12, duration: 0.8, ease: "power2.out" })
      gsap.to(".corner-tr", { x: nx * -12, y: ny * 12, duration: 0.8, ease: "power2.out" })
      gsap.to(".corner-bl", { x: nx * 12, y: ny * -12, duration: 0.8, ease: "power2.out" })
      gsap.to(".corner-br", { x: nx * -12, y: ny * -12, duration: 0.8, ease: "power2.out" })
    }

    window.addEventListener("mousemove", handle)
    return () => window.removeEventListener("mousemove", handle)
  }, [isRevealed])

  // ---- MAIN ANIMATION ----

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {}, containerRef)
    ctxRef.current = ctx

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (prefersReducedMotion) {
      ctx.add(() => {
        setRevealedState()
        startAmbientAnimations()
      })
      const el = document.querySelector(".scramble-target")
      if (el) el.textContent = "sadyoshi"
      setIsRevealed(true)
      return () => ctx.revert()
    }

    ctx.add(() => {
      const words = gsap.utils.toArray<HTMLElement>(".word-particle")
      const vortex = document.querySelector(".vortex-spin") as HTMLElement
      const tl = gsap.timeline()
      timelineRef.current = tl

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

      // ---- PHASE 1: VORTEX FLY-IN (0 – 3s) ----

      tl.to(vortex, { rotation: 420, duration: 3.5, ease: "power1.in" }, 0)

      words.forEach((el, i) => {
        const s = SPAWN[i]
        const enterTime = s.delay * 0.5
        const flight = 2.4 + seeded(i + 70) * 0.6

        tl.to(el, {
          opacity: 0.5 + seeded(i + 80) * 0.4,
          duration: 0.25,
          ease: "power1.out",
        }, enterTime)

        tl.to(el, {
          keyframes: [
            {
              x: Math.round(s.x * 0.4 + s.curveX),
              y: Math.round(s.y * 0.4 + s.curveY),
              rotation: s.rotation * 0.5,
              scale: 0.7,
              duration: flight * 0.55,
              ease: "power1.out",
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 0.35,
              duration: flight * 0.45,
              ease: "power3.in",
            },
          ],
        }, enterTime + 0.1)

        tl.to(el, {
          opacity: 0.15,
          duration: 1,
          ease: "power2.in",
        }, enterTime + flight * 0.5)
      })

      tl.fromTo(
        ".ghost-title",
        { opacity: 0 },
        { opacity: 0.04, duration: 2, ease: "power1.in" },
        1.5,
      )

      tl.to(".vignette", {
        background:
          "radial-gradient(ellipse at center, transparent 5%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 100%)",
        duration: 2,
        ease: "power2.in",
      }, 1.5)

      // ---- PHASE 2: SPHERE FORMATION (3s – 4.8s) ----

      tl.addLabel("sphere", 3)
      tl.to(vortex, { rotation: 0, duration: 0.5, ease: "power2.out" }, "sphere")

      words.forEach((el, i) => {
        const sp = SPHERE_POS[i]
        const depthScale =
          0.25 + ((sp.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.35
        const depthOpacity =
          0.1 + ((sp.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.5

        tl.to(el, {
          x: sp.x,
          y: sp.y,
          scale: depthScale,
          opacity: depthOpacity,
          rotation: 0,
          duration: 0.8,
          ease: "power2.out",
        }, `sphere+=${seeded(i + 90) * 0.3}`)
      })

      tl.addLabel("rotate", 3.8)

      const rotAngle = Math.PI * 0.6
      words.forEach((el, i) => {
        const sp = SPHERE_POS[i]
        const newX = Math.round(
          sp.x * Math.cos(rotAngle) - sp.z * Math.sin(rotAngle),
        )
        const newZ = Math.round(
          sp.x * Math.sin(rotAngle) + sp.z * Math.cos(rotAngle),
        )
        const depthScale =
          0.25 + ((newZ + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.35
        const depthOpacity =
          0.1 + ((newZ + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)) * 0.5

        tl.to(el, {
          x: newX,
          y: sp.y,
          scale: depthScale,
          opacity: depthOpacity,
          duration: 1,
          ease: "sine.inOut",
        }, "rotate")
      })

      tl.fromTo(
        ".sphere-glow",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.3, duration: 1, ease: "power2.in" },
        "rotate",
      )

      // ---- PHASE 3: FLASHBANG (4.8s – 5.3s) ----

      tl.addLabel("flash", 4.8)

      tl.to(".word-particle", {
        opacity: 0.8,
        scale: "+=0.05",
        duration: 0.15,
        ease: "power2.in",
      }, "flash")

      tl.to(".flash-overlay", {
        opacity: 1,
        duration: 0.08,
        ease: "power4.in",
      }, "flash+=0.15")

      tl.set(".words-container", { display: "none" }, "flash+=0.2")
      tl.set(".sphere-glow", { opacity: 0 }, "flash+=0.2")

      tl.to(".flash-overlay", {
        opacity: 0,
        duration: 1.8,
        ease: "power1.out",
      }, "flash+=0.25")

      // ---- PHASE 4: REVEAL (5s+) ----

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

      tl.fromTo(
        ".subtitle",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "reveal+=0.8",
      )

      tl.fromTo(
        ".cycling-word",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: startCyclingWord,
        },
        "reveal+=1.2",
      )

      tl.fromTo(
        ".corner-mark",
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        },
        "reveal+=1",
      )

      tl.fromTo(
        ".bottom-glyph",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" },
        "reveal+=1.2",
      )

      // Ambient breathing
      tl.to(".ghost-title", {
        scale: 1.02,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }, "reveal+=2")

      // Debris
      tl.fromTo(
        ".debris",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.2,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
        },
        "reveal+=0.3",
      )

      tl.to(".debris", {
        x: "random(-300, 300)",
        y: "random(-300, 300)",
        opacity: 0,
        duration: 5,
        stagger: 0.1,
        ease: "power1.out",
      }, "reveal+=1")

      // Trigger post-reveal UI
      tl.call(() => setIsRevealed(true), [], "reveal+=1.8")
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#030303] overflow-hidden"
    >
      {/* Loading overlay — visible during SSR + hydration, fades on mount */}
      <div
        className={`fixed inset-0 z-[200] bg-[#030303] flex items-center justify-center transition-opacity duration-700 pointer-events-none ${
          mounted ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="text-white/20 text-4xl md:text-6xl font-extralight tracking-[0.2em] animate-pulse">
          sadyoshi
        </span>
      </div>

      <div className="fixed inset-0 bg-void" />
      <div className="vignette fixed inset-0 z-10 pointer-events-none" />
      <div
        className="flash-overlay fixed inset-0 bg-white z-[60] pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Cursor glow — subtle radial light that follows the mouse */}
      <div
        className="cursor-glow fixed pointer-events-none z-[5] hidden md:block"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: isRevealed ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      />

      {/* Words */}
      <div className="words-container fixed inset-0 z-20 pointer-events-none">
        <div
          className="vortex-spin absolute top-1/2 left-1/2 w-0 h-0 scale-[0.5] sm:scale-[0.65] md:scale-100"
          style={{ perspective: "800px" }}
        >
          {ALL_WORDS.map((w, i) => (
            <div
              key={i}
              className={`word-particle absolute whitespace-nowrap ${STYLE_CLASSES[w.style]}`}
            >
              {w.style.startsWith("serif") ? (
                <>&ldquo;{w.text}&rdquo;</>
              ) : (
                w.text
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sphere glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[15] pointer-events-none">
        <div
          className="sphere-glow w-[280px] h-[280px] md:w-[500px] md:h-[500px] rounded-full bg-white/[0.06] blur-3xl"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Debris */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] pointer-events-none">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="debris absolute w-1 h-1 bg-white/30 rounded-full"
            style={{ opacity: 0 }}
          />
        ))}
      </div>

      {/* Title group — parallax target */}
      <div className="title-group fixed inset-0 flex flex-col items-center justify-center z-40 pointer-events-none">
        <h1
          className="ghost-title text-5xl md:text-8xl lg:text-9xl font-extralight tracking-[0.15em] md:tracking-[0.2em] text-white mb-3 md:mb-6"
          style={{ opacity: 0 }}
        >
          <span className="scramble-target">sadyoshi</span>
        </h1>
        <div
          className="subtitle text-white/40 text-xs sm:text-sm md:text-lg font-light tracking-[0.2em] md:tracking-[0.3em]"
          style={{ opacity: 0 }}
        >
          an experiment in nothing
        </div>
        <div className="cycling-word mt-6 md:mt-10" style={{ opacity: 0 }}>
          <span className="cycling-word-text text-base sm:text-lg md:text-4xl uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/25 font-extralight">
            {BANNER_WORDS[0]}
          </span>
        </div>
      </div>

      {/* Corner marks — unique classes for parallax */}
      <div
        className="corner-mark corner-tl fixed top-5 left-5 md:top-8 md:left-8 w-4 h-4 md:w-6 md:h-6 border-l border-t border-white/15 z-40"
        style={{ opacity: 0 }}
      />
      <div
        className="corner-mark corner-tr fixed top-5 right-5 md:top-8 md:right-8 w-4 h-4 md:w-6 md:h-6 border-r border-t border-white/15 z-40"
        style={{ opacity: 0 }}
      />
      <div
        className="corner-mark corner-bl fixed bottom-5 left-5 md:bottom-8 md:left-8 w-4 h-4 md:w-6 md:h-6 border-l border-b border-white/15 z-40"
        style={{ opacity: 0 }}
      />
      <div
        className="corner-mark corner-br fixed bottom-5 right-5 md:bottom-8 md:right-8 w-4 h-4 md:w-6 md:h-6 border-r border-b border-white/15 z-40"
        style={{ opacity: 0 }}
      />

      <div
        className="bottom-glyph fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-white/15 text-sm md:text-xl tracking-[0.5em] md:tracking-[0.8em] z-40"
        style={{ opacity: 0 }}
      >
        &#9672; &#9671; &#9672;
      </div>

      {/* Skip button — appears after 1.5s delay */}
      {!isRevealed && mounted && (
        <button
          onClick={skip}
          className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[70] text-white/15 hover:text-white/40 text-[10px] md:text-xs tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer animate-fade-in-delayed"
        >
          skip &rarr;
        </button>
      )}

      {/* Post-reveal: email capture */}
      {isRevealed && (
        <div className="fixed bottom-12 md:bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4 animate-fade-in">
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 md:gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter the void"
                className="bg-transparent border-b border-white/10 text-white/60 text-[11px] md:text-sm tracking-[0.12em] md:tracking-[0.15em] px-1 py-1.5 w-36 md:w-56 focus:outline-none focus:border-white/30 placeholder:text-white/10 transition-colors"
                required
              />
              <button
                type="submit"
                className="text-white/20 hover:text-white/50 text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] transition-colors cursor-pointer"
              >
                notify
              </button>
            </form>
          ) : (
            <span className="text-white/25 text-xs md:text-sm tracking-[0.3em] font-light italic">
              noted.
            </span>
          )}
        </div>
      )}

      {/* Sound toggle */}
      {isRevealed && (
        <button
          onClick={toggleSound}
          className="fixed bottom-4 md:bottom-7 left-5 md:left-8 z-50 text-white/20 hover:text-white/50 transition-colors cursor-pointer group animate-fade-in"
          aria-label={soundOn ? "Mute ambient sound" : "Play ambient sound"}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-3">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`w-[2px] bg-current rounded-full transition-all duration-300 ${
                    soundOn ? "animate-sound-bar" : ""
                  }`}
                  style={{
                    height: soundOn ? undefined : "2px",
                    animationDelay: soundOn ? `${bar * 0.1}s` : undefined,
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {soundOn ? "on" : "off"}
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
