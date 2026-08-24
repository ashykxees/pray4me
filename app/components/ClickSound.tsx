"use client"

import { useEffect } from "react"

type WebAudioContext = typeof AudioContext

function playClick() {
  try {
    const AC: WebAudioContext | undefined =
      (window as unknown as { AudioContext?: WebAudioContext }).AudioContext ||
      (window as unknown as { webkitAudioContext?: WebAudioContext }).webkitAudioContext
    if (!AC) return

    const ctx = new AC()
    if (ctx.state === "suspended") {
      void ctx.resume()
    }

    const t = ctx.currentTime
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(320, t)
    oscillator.frequency.exponentialRampToValueAtTime(240, t + 0.12)

    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.04, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)

    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(t)
    oscillator.stop(t + 0.2)
  } catch {
    // ignore audio errors
  }
}

export function ClickSound() {
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const target = (e.target as HTMLElement).closest(
        "button, a[class*='btn-'], [data-click-sound]"
      )
      if (target) {
        playClick()
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])
  return null
}
