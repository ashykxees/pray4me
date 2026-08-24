import { CountryCode, isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js"
import { getSimpleAlpha2Code } from "i18n-iso-countries"

export function validatePhone(
  phone: string,
  country?: string
): { valid: boolean; formatted?: string } {
  const raw = phone.trim()
  if (!raw) return { valid: false }

  const iso = country
    ? (getSimpleAlpha2Code(country, "en") as CountryCode | undefined) || undefined
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
