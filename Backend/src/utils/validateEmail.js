import validator from "validator";

export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: "Email is required" };
  }

  const normalizedEmail = validator.normalizeEmail(email);

  if (!validator.isEmail(normalizedEmail)) {
    return { valid: false, message: "Invalid email format" };
  }

  return { valid: true, email: normalizedEmail };
};