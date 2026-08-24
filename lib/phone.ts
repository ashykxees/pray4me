export function isPhoneLike(phone: string): boolean {
  const digits = phone.replace(/\D/g, "")
  return digits.length >= 7 && digits.length <= 15
}
