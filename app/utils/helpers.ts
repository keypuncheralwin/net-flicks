/**
 * Validates an email address using a regular expression.
 * @param email - The email address to validate.
 * @returns true if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if a name is not empty.
 * @param name - The name to check.
 * @returns true if the name is not empty, false otherwise.
 */
export function isNotEmpty(name: string): boolean {
  return name.trim().length > 0;
}
