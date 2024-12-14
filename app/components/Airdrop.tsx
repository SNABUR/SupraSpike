"use client";

import { useState, useEffect, useCallback } from "react";

const Airdrop = () => {
  const [provider, setProvider] = useState(null);
  const [memeContract, setMemeContract] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date().getTime();
    const countdownEnd = new Date("2024-12-17T00:00:00Z").getTime(); // Fecha específica
    return countdownEnd - now;
  });
  const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";
  const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE";

  const getProvider = useCallback(() => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      console.log(starkeyProvider,"starkeyProvider")
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

  const sendTokens = async () => {
    const starkeyProvider = getProvider();
    try {
      const accounts = await starkeyProvider.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error("Unable to fetch the account address.");
      }

      const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const rawTxPayload = [
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "faucet",
        "mint",
        [                           // Tipos genéricos (CoinType)
          CONTRACT_ADDRESS_MEME,
        ],
        [
        ],
        optionalTransactionPayloadArgs,
      ];

      const transactionData = await starkeyProvider.createRawTransactionData(rawTxPayload);
      
      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: 8,
        value: "",
      };

      const tx = await starkeyProvider.sendTransaction(params);

    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-7 mb-7 text-gray-800">
      <div className="text-center space-y-1">
        {/*<h1 className="text-4xl font-bold text-purple-700">🚀 Coming Soon</h1>
        <p className="text-lg text-gray-600">Our exciting airdrop event starts in:</p>
        <div className="text-3xl font-mono font-bold text-gray-800 bg-purple-200 rounded-lg px-6 py-1 inline-block">
          {timeLeft > 0 ? formatTime(timeLeft) : "Airdrop is Live!"}
        </div>*/}
<button
  onClick={sendTokens}
  disabled={isLoading}
  className={`w-full max-w-lg px-8 py-4 rounded-xl font-semibold text-xl tracking-wide transition-all transform focus:outline-none shadow-lg ${
    isLoading
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 hover:shadow-2xl active:scale-95"
  }`}
>
  {isLoading ? (
    <div className="flex items-center justify-center space-x-3 animate-pulse">
      <svg
        className="animate-spin h-8 w-8 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
      <span className="text-lg font-medium">Processing...</span>
    </div>
  ) : (
    <span>Claim Airdrop</span>
  )}
</button>

      </div>
    </div>
  );
};

export default Airdrop;
