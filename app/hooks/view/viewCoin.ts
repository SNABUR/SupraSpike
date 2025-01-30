import { useState, useCallback } from "react";

const useViewCoin = () => {
  const [loadingCoin, setLoadingCoin] = useState(false);
  const [errorCoin, setErrorCoin] = useState<string | null>(null);
  const [resultCoin, setResultCoin] = useState<number | null>(null);

  const callViewCoin = useCallback(async (functionName: string, args: any) => {
    const contractFunctionName = `0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32::Liquid_Staking_Token::${functionName}`;

    const payload = {
      function: contractFunctionName,
      type_arguments: [],
      arguments: args, 
    };

    setLoadingCoin(true);
    setErrorCoin(null);

    try {
      const response = await fetch("https://rpc-testnet.supra.com/rpc/v1/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data) {
        console.log(data, "data result from view coin");
        setResultCoin(data); 
      } else {
        throw new Error("No balance returned from the view function.");
      }
    } catch (err: any) {
      console.error("Error in callViewFunction:", err);
      setErrorCoin(err.message || "Something went wrong.");
    } finally {
      setLoadingCoin(false);
    }
  }, []);

  return { resultCoin, loadingCoin, errorCoin, callViewCoin };
};

export default useViewCoin;
