import { ImageResponse } from "next/og"

export const alt = "sadyoshi — an experiment in nothing"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a14, #050508, #030303)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 70%)",
          }}
        />
        <div
          style={{
            fontSize: 120,
            fontWeight: 200,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.85)",
            position: "relative",
          }}
        >
          sadyoshi
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 300,
            letterSpacing: "0.3em",
            color: "rgba(255,255,255,0.35)",
            marginTop: 24,
            position: "relative",
          }}
        >
          an experiment in nothing
        </div>
        <div style={{ position: "absolute", top: 40, left: 40, width: 24, height: 24, borderLeft: "1px solid rgba(255,255,255,0.15)", borderTop: "1px solid rgba(255,255,255,0.15)" }} />
        <div style={{ position: "absolute", top: 40, right: 40, width: 24, height: 24, borderRight: "1px solid rgba(255,255,255,0.15)", borderTop: "1px solid rgba(255,255,255,0.15)" }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 24, height: 24, borderLeft: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 24, height: 24, borderRight: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" }} />
      </div>
    ),
    { ...size },
  )
}
