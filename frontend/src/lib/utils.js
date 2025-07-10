export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
// 🔐 Guest usage helpers

export const checkGuestLimit = (toolKey) => {
  const count = parseInt(localStorage.getItem(toolKey) || '0', 10);
  if (count >= 2) {
    return false;
  }
  localStorage.setItem(toolKey, (count + 1).toString());
  return true;
};

export const resetGuestLimits = () => {
  localStorage.removeItem("jsonFormatterUsage");
  localStorage.removeItem("snippetVaultUsage");
  localStorage.removeItem("codeExplainerUsage");
};
