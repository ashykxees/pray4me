import { CountryCode, isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js"
import { countryToIso } from "./country-iso"

export function validatePhone(
  phone: string,
  country?: string
): { valid: boolean; formatted?: string } {
  const raw = phone.trim()
  if (!raw) return { valid: false }

  const iso = country
    ? (countryToIso[country] as CountryCode | undefined)
    : undefined

  try {
    const valid = iso ? isValidPhoneNumber(raw, iso) : isValidPhoneNumber(raw)
    if (!valid) return { valid: false }

    const parsed = iso
      ? parsePhoneNumberFromString(raw, iso)
      : parsePhoneNumberFromString(raw)

    return { valid: true, formatted: parsed?.formatInternational() || raw }
  } catch {
    return { valid: false }
  }
}
