import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { BCS } from 'aptos';

const useMigratePool = () => {
  // Estados para manejar carga, errores y resultados
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider, walletAddress } = useWallet();

  // Dirección del contrato
  const CONTRACT_ADDRESS = "0x224845715d4011c341443424d5aa362fa59a1002396b8e742c5e27a6be4b645a";

  // Función para comprar memes
  const MigratePool = async (memeName: string, memeSymbol: string) => {
    try {
      // Inicia el estado de carga y resetea el error
      setIsLoading(true);
      setError(null);

      // Define el tiempo de expiración de la transacción
      const txExpiryTime = Math.ceil(Date.now() / 1000) + 60; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };

      // Convierte el símbolo del meme a mayúsculas
      const upperCaseMemeSymbol = memeSymbol.toUpperCase();

      // Construye el payload de la transacción
      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "migrate_to_normal_dex",
        [],
        [
          BCS.bcsSerializeStr(memeName), // Nombre del meme
          BCS.bcsSerializeStr(upperCaseMemeSymbol), // Símbolo del meme en mayúsculas
        ],
        optionalTransactionPayloadArgs,
      ];

      // Genera los datos de la transacción
      const transactionData = await provider.createRawTransactionData(rawTxPayload);
      const networkData = await provider.getChainId();

      // Construye los parámetros de la transacción
      const params = {
        data: transactionData,
        from: walletAddress,
        to: CONTRACT_ADDRESS,
        chainId: networkData.chainId,
        value: "",
      };

      // Envía la transacción
      const tx = await provider.sendTransaction(params);

      if (!tx) {
        console.error("Transaction is empty.");
        return; // Detener ejecución si `tx` está vacío
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
