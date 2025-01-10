import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import {BCS} from "aptos";
import Big from 'big.js';

const useJoinIDO = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { walletAddress, connectWallet, provider } = useWallet(); // Obtén el provider desde el contexto
  const CURRENCY = "0x1::supra_coin::SupraCoin"
  const price_meme = 0.0000000026;
  
  const CONTRACT_ADDRESS_IDO = "0x6e3e09ab7fd0145d7befc0c68d6944ddc1a90fd45b8a6d28c76d8c48bed676b0";
  //const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::meme_spike::SPIKE"; //TESTNET
  const CONTRACT_ADDRESS_MEME = "0x0fec116479f1fd3cb9732cc768e6061b0e45b178a610b9bc23c2143a6493e794::memecoins::SPIKE"; //MAINNET

  
  const JoinIDO = async (joinDeposit: number) => {
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
        CONTRACT_ADDRESS_IDO,
        "ido",
        "joinIdo",
        [
          CURRENCY,
          CONTRACT_ADDRESS_MEME
        ], // Arguments for the mint function
        [
            BCS.bcsSerializeUint64(Number(Big(joinDeposit*1000/price_meme).toFixed(0,0))), //amount tokens Spike to buyt
        ],
        optionalTransactionPayloadArgs,
      ];

      setIsLoading(true);
      setError(null);
  
      const transactionData = await provider.createRawTransactionData(rawTxPayload);
      const networkData = await provider.getChainId();
      console.log("networkData", networkData);
  
      const params = {
        data: transactionData,
        from: walletAddress,
        to: CONTRACT_ADDRESS_IDO,
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

  return { JoinIDO, isLoading, error, result };
};

export default useJoinIDO;
