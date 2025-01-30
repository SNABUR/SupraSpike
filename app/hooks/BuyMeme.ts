import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { BCS } from 'aptos';
import Big from 'big.js';

const useBuyMeme = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider, walletAddress } = useWallet();

  const CONTRACT_ADDRESS = "0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32";

  const BuyMeme = async (memeName: string, memeSymbol: string, BuyAmountSupra: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const txExpiryTime = Math.ceil(Date.now() / 1000) + 60; 
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const BuyAmountSupraAdjusted = (Number(BuyAmountSupra) * 100000000).toString();

      const upperCaseMemeSymbol = memeSymbol.toUpperCase();

      const payload = {
        function: CONTRACT_ADDRESS + "::pump_fa::buy_supra_amount",
        type_arguments: [], 
        arguments: [memeName.toString(), memeSymbol.toString(), BuyAmountSupraAdjusted],
      };

      const response = await fetch("https://rpc-testnet.supra.com/rpc/v1/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error in view function: ${response.statusText}`);
      }

      const CallView = await response.json();
      const BuyAmountRaw = CallView.result[0];

      if (isNaN(Number(BuyAmountRaw))) {
        throw new Error("BuyAmount is not a valid number");
      }
      const BuyAmount = Number(BuyAmountRaw);

      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "buy",
        [],
        [
          BCS.bcsSerializeStr(memeName), 
          BCS.bcsSerializeStr(upperCaseMemeSymbol), 
          BCS.bcsSerializeUint64(Number(Big(Number(BuyAmount)).toFixed(0, 0))),
        ],
        optionalTransactionPayloadArgs,
      ];

      const transactionData = await provider.createRawTransactionData(rawTxPayload);
      const networkData = await provider.getChainId();

      const params = {
        data: transactionData,
        from: walletAddress,
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };

      const tx = await provider.sendTransaction(params);

      if (!tx) {
        console.log("Transaction is empty.");
        return; 
      }

      setResult(tx);

    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { BuyMeme, isLoading, error, result };
};

export default useBuyMeme;
