export const formatTime = (total: number): string => {
  const mm = Math.floor(total / 60).toString().padStart(2, "0");
  const ss = Math.floor(total % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
};


