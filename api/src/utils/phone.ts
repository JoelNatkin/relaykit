const E164_US = /^\+1\d{10}$/;

export function isValidE164(phone: string): boolean {
  return E164_US.test(phone);
}

export function normalizePhone(input: string): string {
  if (!input) throw new Error('Phone number is required');

  // If already starts with +, validate as-is
  if (input.startsWith('+')) {
    if (isValidE164(input)) return input;
    throw new Error(`Invalid phone number: ${input} (only US +1 numbers supported)`);
  }

  // Strip all non-digit characters
  const digits = input.replace(/\D/g, '');

  if (digits.length === 10) {
    const result = `+1${digits}`;
    if (isValidE164(result)) return result;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    const result = `+${digits}`;
    if (isValidE164(result)) return result;
  }

  throw new Error(`Invalid phone number: ${input} (only US +1 numbers supported)`);
}
