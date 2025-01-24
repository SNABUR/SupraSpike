import { useState, useCallback } from "react";

const useViewFunction = () => {
    const [loadingView, setLoadingView] = useState(false);
    const [errorView, setErrorView] = useState(null);
    const [resultView, setResultView] = useState(null);

    const callViewFunction = useCallback(async (functionName: string, args: any) => {
        const contractFunctionName = `0x224845715d4011c341443424d5aa362fa59a1002396b8e742c5e27a6be4b645a::pump_fa::${functionName}`;

        const payload = {
            function: contractFunctionName,
            type_arguments: [], // Tipos genéricos si aplica
            arguments: args,
        };

        setLoadingView(true);
        setErrorView(null);

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
                console.log(data, "data result from view");
                setResultView(data);
            } else {
                throw new Error("No result returned from the view function.");
            }
        } catch (err: any) {
            console.error("Error in callViewFunction:", err);
            setErrorView(err.message || "Something went wrong.");
        } finally {
            setLoadingView(false);
        }
    }, []);

    return { resultView, loadingView, errorView, callViewFunction };
};

export default useViewFunction;
