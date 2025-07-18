// 🔧 Tailwind class name helper
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// 🔐 Guest usage config
const MAX_GUEST_LIMIT = 2;

// 🔢 Get usage info for a tool (used for display or syncing)
export const getGuestUsage = (toolKey) => {
  const usageData = JSON.parse(localStorage.getItem(toolKey)) || { count: 0, date: null };
  const today = new Date().toISOString().split("T")[0];

  if (usageData.date !== today) {
    return { count: 0, date: today };
  }

  return usageData;
};

// 🚫 Check and increment guest limit (return false if blocked)
export const checkGuestLimit = (toolKey) => {
  const { count, date } = getGuestUsage(toolKey);
  const today = new Date().toISOString().split("T")[0];

  if (count >= MAX_GUEST_LIMIT) return false;

  const updated = { count: count + 1, date: today };
  localStorage.setItem(toolKey, JSON.stringify(updated));
  return true;
};

// 🔁 Optional reset function (for testing or logout)
export const resetGuestLimits = () => {
  localStorage.removeItem("snippetVaultUsage");
  localStorage.removeItem("jsonFormatterUsage");
  localStorage.removeItem("codeExplainerUsage");
};

// 🆔 Guest ID management (used for per-device snippet isolation)
export const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    // Generate a unique ID using crypto or fallback
    guestId = crypto?.randomUUID?.() || generateSimpleId();
    localStorage.setItem("guestId", guestId);
  }

  return guestId;
};

// 🔧 Fallback guest ID generator (if crypto is not available)
const generateSimpleId = () => {
  return "guest-" + Math.random().toString(36).substring(2, 12);
};
