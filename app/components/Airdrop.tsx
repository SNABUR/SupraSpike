"use client";

import { useState, useEffect, useCallback } from "react";

const Airdrop = () => {
  const [provider, setProvider] = useState(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date().getTime();
    const countdownEnd = new Date("2024-12-17T00:00:00Z").getTime(); // Fecha específica
    return countdownEnd - now;
  });

  const getProvider = useCallback(() => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      setProvider(starkeyProvider);
      return starkeyProvider || null;
    }
    return null;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1000;
        if (newTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      console.error("Provider not available");
      return;
    }
  }, [getProvider]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center mt-7 mb-7 bg-gray-50 text-gray-800">
      <div className="text-center space-y-1">
        <h1 className="text-4xl font-bold text-purple-700">🚀 Coming Soon</h1>
        <p className="text-lg text-gray-600">Our exciting airdrop event starts in:</p>
        <div className="text-3xl font-mono font-bold text-gray-800 bg-purple-200 rounded-lg px-6 py-1 inline-block">
          {timeLeft > 0 ? formatTime(timeLeft) : "Airdrop is Live!"}
        </div>
      </div>
    </div>
  );
};

export default Airdrop;
