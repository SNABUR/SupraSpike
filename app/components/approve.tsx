"use client";

import { useState, useEffect, useCallback } from "react";

const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";

const InteractWithContract = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderAvailable, setIsProviderAvailable] = useState<boolean>(true);
  const [provider, setProvider] = useState<any>(null);

  const getProvider = useCallback(() => {
    if (typeof window !== "undefined" && "starkey" in window) {
      const starkeyProvider = (window as any)?.starkey.supra;
      setProvider(starkeyProvider);
      return starkeyProvider || null;
    }
    return null;
  }, []);

  useEffect(() => {
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      setIsProviderAvailable(false);
      return;
    }

    const handleAccountChanged = (accounts: string[]) =>
      console.log("Accounts changed:", accounts);

    const handleNetworkChanged = (networkData: any) =>
      console.log("Network changed:", networkData);

    const handleDisconnect = () => {
      console.warn("Disconnected from StarKey Wallet");
      setIsProviderAvailable(false);
    };

    starkeyProvider.on("accountChanged", handleAccountChanged);
    starkeyProvider.on("networkChanged", handleNetworkChanged);
    starkeyProvider.on("disconnect", handleDisconnect);

    return () => {
      starkeyProvider.off("accountChanged", handleAccountChanged);
      starkeyProvider.off("networkChanged", handleNetworkChanged);
      starkeyProvider.off("disconnect", handleDisconnect);
    };
  }, [getProvider]);

  const registerToken = async () => {
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      setError("StarKey Wallet is not installed or unsupported.");
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await starkeyProvider.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error("Unable to fetch the account address.");
      }

      const networkData = await starkeyProvider.getChainId();
      const rawTxPayload = [
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "meme_spike",
        "register_SPIKE",
        [],
        [],
        { txExpiryTime: Math.ceil(Date.now() / 1000) + 30 },
      ];

      const transactionData = await starkeyProvider.createRawTransactionData(rawTxPayload);

      const params = {
        data: transactionData,
        from: accounts[0],
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };

      const tx = await starkeyProvider.sendTransaction(params);

      setResult(tx);
      setError(null);
    } catch (err) {
      console.error("Error registering the token:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-7">
      <button
        onClick={registerToken}
        disabled={isLoading}
        className={`w-full max-w-md px-6 py-3 rounded-lg shadow-md font-semibold text-lg transition-all transform ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg active:scale-95"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="animate-spin h-6 w-6 text-white"
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
            <span>Processing...</span>
          </div>
        ) : (
          "Register Token"
        )}
      </button>

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>
            <strong>Transaction Successful:</strong> {result}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractWithContract;
