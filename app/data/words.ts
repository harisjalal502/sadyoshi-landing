export type WordStyle =
  | "code-xs" | "code-sm" | "code-lg" | "code-xl"
  | "serif-md" | "serif-lg" | "serif-xl" | "serif-hero"
  | "sans-xs" | "sans-md" | "sans-xl"
  | "display"

export const BANNER_WORDS = [
  "ILLUMINATE", "TRANSCEND", "AWAKEN", "SURRENDER",
  "JOIN NOW", "OBEY THE VOID", "BECOME NOTHING", "ASCEND",
  "DISSOLVE", "ENLIGHTEN", "SUBMIT", "FORGET YOURSELF",
  "EMBRACE CHAOS", "TRUST THE PROCESS", "LET GO", "BELIEVE",
  "SACRIFICE LOGIC", "ACCEPT THE ABSURD", "FOLLOW THE SIGNAL",
  "REJECT MEANING", "WORSHIP ENTROPY", "OPEN YOUR EYES",
  "CLOSE YOUR MIND", "FEEL EVERYTHING",
]

export const ALL_WORDS: { text: string; style: WordStyle }[] = [
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

export const STYLE_CLASSES: Record<WordStyle, string> = {
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

export function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return Math.round((x - Math.floor(x)) * 1000) / 1000
}

export const N = ALL_WORDS.length

export const SPHERE_RADIUS = 280

export const SPAWN = ALL_WORDS.map((_, i) => {
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

export const SPHERE_POS = ALL_WORDS.map((_, i) => {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const theta = goldenAngle * i
  const y = 1 - (2 * i) / (N - 1)
  const radiusAtY = Math.sqrt(1 - y * y)

  return {
    x: Math.round(Math.cos(theta) * radiusAtY * SPHERE_RADIUS),
    y: Math.round(y * SPHERE_RADIUS),
    z: Math.round(Math.sin(theta) * radiusAtY * SPHERE_RADIUS),
  }
})
