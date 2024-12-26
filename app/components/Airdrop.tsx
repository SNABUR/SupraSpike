"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const Airdrop = () => {
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0); // Controla el progreso de los pasos

  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date().getTime();
    const countdownEnd = new Date("2024-12-17T00:00:00Z").getTime(); // Fecha específica
    return countdownEnd - now;
  });
  const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";
  const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE";

  const getProvider = useCallback(async () => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      setProvider(starkeyProvider);

      if (starkeyProvider) {
        const currentNetwork = await starkeyProvider.getChainId();
        if (currentNetwork.chainId !== 8) {
          await starkeyProvider.changeNetwork({ chainId: 8 });
          console.log("Network changed to chainId 8");
        }
      }

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
    const initializeProvider = async () => {
      const starkeyProvider = await getProvider();
      if (!starkeyProvider) {
        console.error("Provider not available");
      }
    };

    initializeProvider();
  }, [getProvider]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getTokens = async () => {
    setIsLoading(true); // Indica que se está procesando la solicitud
    try {
      const starkeyProvider = await getProvider();
      if (!starkeyProvider) {
        throw new Error("Starkey provider not found.");
      }

      const currentNetwork = await starkeyProvider.getChainId();
      if (currentNetwork.chainId !== 8) {
        await starkeyProvider.changeNetwork({ chainId: 8 });
        console.log("Network changed to chainId 8");
      }

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
        [
          CONTRACT_ADDRESS_MEME,
        ],
        [],
        optionalTransactionPayloadArgs,
      ];

      const transactionData = await starkeyProvider.createRawTransactionData(rawTxPayload);
      const networkData = await starkeyProvider.getChainId();

      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };

      const tx = await starkeyProvider.sendTransaction(params);
      console.log("Transaction sent:", tx);

    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      text: "Follow us on Twitter",
      link: "https://x.com/supra_spikes",
      icon: "./twitter.svg", // Ruta del ícono

    },
    {
      text: "Like & Retweet",
      link: "https://x.com/supra_spike/status/1870090839483122010",
      icon: "./retweet.svg", // Ruta del ícono

    },
    {
      text: "Claim Airdrop",
      action: getTokens, // Llama a la función getTokens
      icon: null, // Sin ícono para este botón

    },
  ];


  return (
    <div className="flex flex-col items-center justify-center mt-7 mb-7 text-gray-800">
      <div className="text-center space-y-4">
        {steps.map((stepData, index) => (
          <div key={index}>
            {index < steps.length - 1 ? (
              // Botones Minimalistas para "Follow" y "Like & Retweet"
              <button
                onClick={() => {
                  window.open(stepData.link, "_blank"); // Abre el enlace
                  setStep(step + 1); // Avanza al siguiente paso
                }}
                disabled={false} // Siempre habilitado
                className={`flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-full border focus:outline-none transition-all ${
                  step === index
                    ? "border-purple-500 bg-purple-600 text-white hover:bg-purple-500"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                {stepData.icon && (
                  <Image src={stepData.icon} alt={stepData.text} width={20} height={20} className="invert"/>
                )}
                <span>{stepData.text}</span>
              </button>
            ) : (
              // Botón Llamativo para "Claim Airdrop"
              <button
                onClick={() => {
                  if (stepData.action) stepData.action();
                }}
                disabled={false || isLoading}
                className={`w-full max-w-lg px-8 py-4 rounded-xl font-semibold text-xl tracking-wide transition-all transform focus:outline-none shadow-lg ${
                  step === index
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 hover:shadow-2xl active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
                  <span>{stepData.text}</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Airdrop;
