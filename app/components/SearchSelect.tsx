"use client"

import { useId, useMemo, useRef, useState } from "react"

interface SearchSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder,
  label,
  disabled,
}: SearchSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selectedRef = useRef(false)
  const listboxId = useId()

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase()
    if (!q) return options
    return options
      .filter((o) => o.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(q) ? -1 : 1
        const bStarts = b.toLowerCase().startsWith(q) ? -1 : 1
        return aStarts - bStarts || a.localeCompare(b)
      })
  }, [options, value])

  const select = (option: string) => {
    selectedRef.current = true
    onChange(option)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    if (!open) setOpen(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false)
      if (selectedRef.current) {
        selectedRef.current = false
        return
      }
      const exact = options.find((o) => o.toLowerCase() === value.trim().toLowerCase())
      if (exact) {
        onChange(exact)
      }
      // Intentionally do NOT auto-select the first filtered option on blur.
      // The user must click/press Enter to choose, so typing "Un" does not
      // silently become a wrong country.
    }, 120)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (open && filtered.length > 0) {
        const exact = filtered.find(
          (o) => o.toLowerCase() === value.trim().toLowerCase()
        )
        select(exact || filtered[0])
      }
    }
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  const hasOptions = options.length > 0

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="label">{label}</label>}
      <input
        id={listboxId}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId + "-listbox"}
        aria-expanded={open}
        value={value}
        onChange={handleInputChange}
        onFocus={() => hasOptions && setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || false}
        className="input"
        autoComplete="off"
      />
      {open && hasOptions && (
        <ul
          id={listboxId + "-listbox"}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-brand-tan/40 bg-white/95 py-2 shadow-xl backdrop-blur-sm"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sm text-brand-sand">No results</li>
          ) : (
            filtered.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                onMouseDown={(e) => {
                  e.preventDefault()
                  select(option)
                }}
                className="cursor-pointer px-4 py-2.5 text-sm text-brand-brown-dark transition hover:bg-brand-beige"
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
