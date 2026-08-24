import { CountryCode, isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js"
import { countryToIso } from "./country-iso"

export function resolveCountry(country?: string): CountryCode | undefined {
  if (!country) return undefined

  const exact = countryToIso[country]
  if (exact) return exact as CountryCode

  const lower = country.trim().toLowerCase()
  for (const [name, code] of Object.entries(countryToIso)) {
    if (name.toLowerCase() === lower) return code as CountryCode
  }

  return undefined
}

export function validatePhone(
  phone: string,
  country?: string
): { valid: boolean; formatted?: string; countryCode?: string } {
  const raw = phone.trim()
  if (!raw) return { valid: false }

  const iso = resolveCountry(country)

  try {
    const valid = iso ? isValidPhoneNumber(raw, iso) : isValidPhoneNumber(raw)
    if (!valid) return { valid: false, countryCode: iso }

    const parsed = iso
      ? parsePhoneNumberFromString(raw, iso)
      : parsePhoneNumberFromString(raw)

    return { valid: true, formatted: parsed?.formatInternational() || raw, countryCode: iso }
  } catch {
    return { valid: false, countryCode: iso }
  }
}


