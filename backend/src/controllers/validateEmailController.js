import { checkEmailSMTP } from '../utils/checkEmailSMTP.js';

/**
 * Validate basic email syntax
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if syntax is valid
 */
function isValidEmailSyntax(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate email endpoint - checks syntax and SMTP deliverability
 * POST /api/v1/validate-email
 */
export async function validateEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid email',
      });
    }

    // Step 1: Check syntax
    if (!isValidEmailSyntax(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email syntax',
      });
    }

    // Step 2: Check SMTP deliverability
    const isDeliverable = await checkEmailSMTP(email);

    return res.status(200).json({
      success: true,
      syntax: true,
      deliverable: isDeliverable,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }
}
