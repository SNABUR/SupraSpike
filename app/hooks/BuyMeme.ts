import { useState } from 'react';
import { useWallet } from "../context/walletContext"; // Importa el hook del contexto
import { BCS } from 'aptos';
import Big from 'big.js';

const useBuyMeme = () => {
  // Estados para manejar carga, errores y resultados
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState(null);
  const { provider, walletAddress } = useWallet();

  // Dirección del contrato
  const CONTRACT_ADDRESS = "0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32";

  // Función para comprar memes
  const BuyMeme = async (memeName: string, memeSymbol: string, BuyAmountSupra: string) => {
    try {
      // Inicia el estado de carga y resetea el error
      setIsLoading(true);
      setError(null);

      // Define el tiempo de expiración de la transacción
      const txExpiryTime = Math.ceil(Date.now() / 1000) + 60; // 30 seconds expiry
      const optionalTransactionPayloadArgs = { txExpiryTime };
      const BuyAmountSupraAdjusted = (Number(BuyAmountSupra) * 100000000).toString();

      // Convierte el símbolo del meme a mayúsculas
      const upperCaseMemeSymbol = memeSymbol.toUpperCase();

      // Construye el payload para la función de vista
      const payload = {
        function: CONTRACT_ADDRESS + "::pump_fa::buy_supra_amount",
        type_arguments: [], // Tipos genéricos si aplica
        arguments: [memeName.toString(), memeSymbol.toString(), BuyAmountSupraAdjusted],
      };

      // Llama a la función de vista
      const response = await fetch("https://rpc-testnet.supra.com/rpc/v1/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Verifica si la respuesta es válida
      if (!response.ok) {
        throw new Error(`Error in view function: ${response.statusText}`);
      }

      // Procesa el resultado de la función de vista
      const CallView = await response.json();
      const BuyAmountRaw = CallView.result[0];

      // Valida que el resultado sea un número
      if (isNaN(Number(BuyAmountRaw))) {
        throw new Error("BuyAmount is not a valid number");
      }
      const BuyAmount = Number(BuyAmountRaw);

      // Construye el payload de la transacción
      const rawTxPayload = [
        walletAddress,
        0,
        CONTRACT_ADDRESS,
        "pump_fa",
        "buy",
        [],
        [
          BCS.bcsSerializeStr(memeName), // Nombre del meme
          BCS.bcsSerializeStr(upperCaseMemeSymbol), // Símbolo del meme en mayúsculas
          BCS.bcsSerializeUint64(Number(Big(Number(BuyAmount)).toFixed(0, 0))), // Cantidad de tokens SPIKE a comprar
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
        console.log("Transaction is empty.");
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

  return { BuyMeme, isLoading, error, result };
};

export default useBuyMeme;
