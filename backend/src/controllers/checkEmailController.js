import { checkEmailSMTP } from '../utils/checkEmailSMTP.js';

/**
 * Normalize names by trimming, lowercasing, and removing extra spaces
 * @param {string} str - String to normalize
 * @returns {string} - Normalized string
 */
function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Generate email guess patterns based on name and domain
 * @param {string} name - Person's name
 * @param {string} domain - Email domain
 * @returns {string[]} - Array of email guesses
 */
function generateGuesses(name, domain) {
  const parts = normalize(name).split(' ');
  if (parts.length < 2) return [];

  const firstParts = parts.slice(0, Math.ceil(parts.length / 2));
  const lastParts = parts.slice(Math.ceil(parts.length / 2));
  const guesses = new Set();

  for (const first of firstParts) {
    for (const last of lastParts) {
      guesses.add(`${first}@${domain}`);
      guesses.add(`${last}@${domain}`);
      guesses.add(`${first}.${last}@${domain}`);
      guesses.add(`${last}.${first}@${domain}`);
      guesses.add(`${first}${last}@${domain}`);
      guesses.add(`${last}${first}@${domain}`);
      guesses.add(`${first.charAt(0)}${last}@${domain}`);
      guesses.add(`${first.charAt(0)}.${last}@${domain}`);
      guesses.add(`${first.charAt(0)}${last.charAt(0)}@${domain}`);
    }
  }

  return Array.from(guesses);
}

/**
 * Check email endpoint - generates and validates email guesses
 * POST /api/v1/check-email
 */
export async function checkEmail(req, res) {
  try {
    const { name, domain } = req.body;

    if (!name || !domain) {
      return res.status(400).json({
        success: false,
        message: 'Missing name or domain',
      });
    }

    const guesses = generateGuesses(name, domain);

    for (const guess of guesses) {
      const isValid = await checkEmailSMTP(guess);
      if (isValid) {
        return res.status(200).json({
          success: true,
          email: guess,
          message: 'ok',
        });
      }
    }

    return res.status(200).json({
      success: false,
      message: 'No valid email found',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
