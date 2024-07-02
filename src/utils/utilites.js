export const isMobile = () => window.innerWidth <= 768;

export const trimString = (text) => (typeof text === "string" ? text.trim() : text);
