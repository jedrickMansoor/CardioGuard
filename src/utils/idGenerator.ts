// GENERATE USER ID WITHOUT DOT
export const generateUserId = (role: string) => {
  const prefixMap: Record<string, string> = {
    admin: "ADM",
    patient: "PAT",
    doctor: "DOC",
  };
  const prefix = prefixMap[role] || "GUS";

  const uniquePart = (Date.now() + Math.floor(Math.random() * 1e6)).toString(36);
  
  return `${prefix}-${uniquePart}`;
};  