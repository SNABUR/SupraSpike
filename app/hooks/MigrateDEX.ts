import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { BCS } from 'aptos';

const useMigratePool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider, walletAddress } = useWallet();

  const CONTRACT_ADDRESS = "0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32";

  const MigratePool = async (memeName: string, memeSymbol: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const txExpiryTime = Math.ceil(Date.now() / 1000) + 60; 
      const optionalTransactionPayloadArgs = { txExpiryTime };

      const upperCaseMemeSymbol = memeSymbol.toUpperCase();

      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "migrate_to_normal_dex",
        [],
        [
          BCS.bcsSerializeStr(memeName), 
          BCS.bcsSerializeStr(upperCaseMemeSymbol), 
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
        console.error("Transaction is empty.");
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

  return { MigratePool, isLoading, error, result };
};

export default useMigratePool;
