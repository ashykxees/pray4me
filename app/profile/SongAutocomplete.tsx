"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ExternalLink, Music, Pause, Play } from "lucide-react"
import { searchSongs, type SongResult } from "./actions"

interface SongAutocompleteProps {
  value: string
  previewUrl?: string | null
  trackUrl?: string | null
  onChange: (song: {
    favoriteSong?: string
    favoriteSongPreviewUrl?: string
    favoriteSongUrl?: string
  }) => void
}

function displayFor(result: SongResult) {
  return `${result.trackName} - ${result.artistName}`
}

export function SongAutocomplete({ value, previewUrl, trackUrl, onChange }: SongAutocompleteProps) {
  const id = useId()
  const [options, setOptions] = useState<SongResult[]>([])
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      async function fetchSongs() {
        const results = await searchSongs(value)
        setOptions(results)
      }
      void fetchSongs()
    }, 300)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [value])

  useEffect(() => {
    const audio = new Audio(previewUrl || "")
    audioRef.current = audio

    const onEnded = () => setPlaying(false)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("ended", onEnded)
      audioRef.current = null
    }
  }, [previewUrl])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !previewUrl) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  function select(result: SongResult) {
    setOpen(false)
    onChange({
      favoriteSong: displayFor(result),
      favoriteSongPreviewUrl: result.previewUrl,
      favoriteSongUrl: result.trackViewUrl,
    })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ favoriteSong: e.target.value })
    setOpen(true)
  }

  return (
    <div>
      <div className="relative">
        <label htmlFor={id} className="label flex items-center gap-2">
          <Music className="h-4 w-4" />
          Favorite Worship Song
        </label>
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Start typing a song title..."
          autoComplete="off"
          className="input"
        />

        {open && (
          <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-brand-tan/40 bg-white/95 py-2 shadow-xl backdrop-blur-sm">
            {options.length === 0 ? (
              <li className="px-4 py-2 text-sm text-brand-sand">
                {value.trim().length < 2 ? "Type to search songs" : "No results"}
              </li>
            ) : (
              options.map((result) => {
                const display = displayFor(result)
                return (
                  <li
                    key={result.trackViewUrl}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      select(result)
                    }}
                    className="cursor-pointer px-4 py-2.5 text-sm text-brand-brown-dark transition hover:bg-brand-beige"
                  >
                    {display}
                  </li>
                )
              })
            )}
          </ul>
        )}
      </div>

      {(previewUrl || trackUrl) && (
        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-brand-tan/40 bg-white/80 p-3 shadow-sm">
          {previewUrl && (
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-brown text-white shadow-md transition hover:scale-105 active:scale-95"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-brand-brown-dark">{value}</p>
            <p className="truncate text-xs text-brand-sand">
              {previewUrl ? "30-second preview" : "No preview available"}
            </p>
          </div>
          {trackUrl && (
            <a
              href={trackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-shrink-0 px-4 py-2 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          )}
        </div>
      )}
    </div>
  )
}
