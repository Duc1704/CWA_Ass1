import { useEffect, useState } from "react";

export default function useTimer(initial: number) {
  const [remaining, setRemaining] = useState<number>(initial);
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setRemaining((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = (n: number) => { setRunning(false); setRemaining(n); };

  return { remaining, running, start, pause, reset, setRunning, setRemaining } as const;
}


