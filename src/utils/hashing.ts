import bcrypt from "bcrypt";

// HASH PASSWORD
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // industry standard
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

// COMPARE PASSWORD
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};