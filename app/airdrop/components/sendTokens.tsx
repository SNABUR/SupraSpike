"use client";

import { useState, useEffect, useCallback } from "react";
import {BCS, TxnBuilderTypes} from "aptos";
import Big from "big.js";

const CONTRACT_ADDRESS = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794";

const SendTokens = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      console.error("Provider not available");
      return;
    }
  
  }, [getProvider]);
  

  const sendTokens = async () => {
    const starkeyProvider = getProvider();
    if (!starkeyProvider) {
      setError("StarKey Wallet is not installed or unsupported.");
      return;
    }

    if (!recipient.match(/^0x[a-fA-F0-9]{64}$/)) {
      setError("Invalid recipient address format.");
      return;
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please provide a valid integer amount.");
      return;
    }
    console.log("Parsed Amount:", parsedAmount); // Confirmar valor
    

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await starkeyProvider.connect();
      if (!accounts || accounts.length === 0) {
        throw new Error("Unable to fetch the account address.");
      }

      const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };

      const token = new TxnBuilderTypes.TypeTagStruct(TxnBuilderTypes.StructTag.fromString("0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"));

      const rawTxPayload = [
        accounts[0],
        0,
        CONTRACT_ADDRESS,
        "0x1::coin",
        "transfer",
        [token],
        [
          BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(recipient)),
          BCS.bcsSerializeUint64(Number(Big(amount).toFixed(0,0)))
        ],
        optionalTransactionPayloadArgs,
      ];

      const serializedAmount = BCS.bcsSerializeUint64(BigInt(parsedAmount));
      console.log("Serialized Amount:", serializedAmount);

      console.log("Raw Transaction Payload:", rawTxPayload);

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
      setResult(tx);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-7">
      <h2 className="text-xl font-bold text-purple-700">Send Tokens</h2>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value.trim())}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-500"
        />
      </div>
      <button
        onClick={sendTokens}
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
          "Send Tokens"
        )}
      </button>

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>
            <strong>Transaction Successful:</strong>{" "}
            <a
              href={`https://testnet.suprascan.io/tx/${result}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View on Explorer
            </a>
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

export default SendTokens;
