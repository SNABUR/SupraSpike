"use client";

import { useState, useEffect, useCallback } from "react";

const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";
const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE";

const InteractWithContract = () => {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProviderAvailable, setIsProviderAvailable] = useState<boolean>(true);
  const [provider, setProvider] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS_MEME).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => console.error("Failed to copy: ", err)
    );
  };

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

    starkeyProvider.on("accountChanged", (accounts: any) =>
      console.log("Accounts changed:", accounts)
    );

    starkeyProvider.on("networkChanged", (networkData: any) =>
      console.log("Network changed:", networkData)
    );

    starkeyProvider.on("disconnect", () => {
      console.warn("Disconnected from StarKey Wallet");
      setIsProviderAvailable(false);
    });
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

      const networkData = await starkeyProvider.getChainId(); //mainnet is 8
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
    <div className="space-y-3 mt-3">
      {/* Step 1: Add Token */}
      <div className="bg-purple-100 text-purple-700 p-3 rounded-lg shadow-md">

        <p className="text-center mb-5 text-lg font-semibold text-purple-700">
          ✨ First, add the <span className="text-black font-bold">$SPIKE</span> token to your wallet through <span className="text-yellow-900 font-bold">Manage Token</span> in the StarKey Wallet to get started! 🦔💜
        </p>
        <div className="flex items-center justify-center gap-2 mt-1 mb-3 bg-purple-200 text-purple-800 px-6 py-3 rounded-lg shadow-md">
            <span className="font-mono text-sm">
              {CONTRACT_ADDRESS_MEME.slice(0, 7)}...{CONTRACT_ADDRESS_MEME.slice(-12)}
            </span>
            <button
              onClick={copyToClipboard}
              className="bg-purple-700 text-white px-4 py-1 rounded-md hover:bg-purple-800 transition"
            >
              Copy
            </button>
          </div>


        <div className="mt-6 w-full max-w-lg mx-auto">

          {copySuccess && (
            <p className="text-green-400 text-center text-sm mt-2">
              Contract address copied to clipboard!
            </p>
          )}
        </div>
      </div>
      {/* Success Message */}
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          <p>
            <strong>Approval Successful:</strong> Your token has been successfully approved. You can now receive tokens in your wallet.
          </p>
        </div>
      )}
  
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
    </div>
  );
  
};

export default InteractWithContract;
