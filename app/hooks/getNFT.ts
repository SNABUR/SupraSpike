import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import {BCS} from "aptos";

const useGetNFT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { connectWallet, provider, walletAddress } = useWallet(); // Obtén el provider desde el contexto
  const CONTRACT_ADDRESS = "0xa8ff8aa5c6cf9b7511250ca1218efee986a38c50c6f794dff95389623e759a4b";

  const mintNFT = async () => {
    if (!walletAddress) {
      await connectWallet();
      return
    }
    try {
    setIsLoading(true);
    setError(null);
      const txExpiryTime = Math.ceil(Date.now() / 1000) + 30; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "nft",
        "mint",
        [], // Arguments for the mint function
        [
          BCS.bcsSerializeUint64(Number(1)), //amount to deposit in vault faucet
        ],
        optionalTransactionPayloadArgs,
      ];  
      const transactionData = await provider.createRawTransactionData(rawTxPayload);
      const networkData = await provider.getChainId();
      console.log("networkData", networkData);
  
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
        return; // Detener ejecución si `tx` está vacío
      }
      console.log("networkData.chainId", networkData.chainId);

      console.log("Transaction sent:", tx);
      setResult(tx);
    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mintNFT, isLoading, error, result };
};

export default useGetNFT;
