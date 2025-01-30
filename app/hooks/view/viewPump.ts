import { useState, useCallback } from "react";

const useViewFunction = () => {
    const [loadingView, setLoadingView] = useState(false);
    const [errorView, setErrorView] = useState(null);
    const [resultView, setResultView] = useState(null);

    const callViewFunction = useCallback(async (functionName: string, args: any) => {
        const contractFunctionName = `0x8ca3b113f2078264e479af7f548e113731d626878cfcfe9f2f2bd12b53741d32::pump_fa::${functionName}`;

        const payload = {
            function: contractFunctionName,
            type_arguments: [], 
            arguments: args,
        };

        setLoadingView(true);
        setErrorView(null);
        console.log("before call payload in viewpump");
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
