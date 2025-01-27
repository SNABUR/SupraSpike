import React, { useEffect } from "react";
import { useWallet } from "./context/walletContext";
import WalletButton from "./WalletButton";

interface WalletsProps {
    visibleWallets: boolean;
    onCloseWallets: () => void;
}

const Wallets: React.FC<WalletsProps> = ({ visibleWallets, onCloseWallets }) => {
    const { connectWallet, walletAddress } = useWallet();

    useEffect(() => {
        if (walletAddress) onCloseWallets();
    }, [walletAddress, onCloseWallets]);

    const handleOnClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).id === "container_wallets") onCloseWallets();
    };

    if (!visibleWallets) return null;

    return (
        <div
            id="container_wallets"
            onClick={handleOnClose}
            className="fixed z-40 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        >
            <div className="w-96 bg-white rounded-2xl shadow-lg p-6 relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Connect Wallet</h2>
                    <button
                        onClick={onCloseWallets}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Select your wallet to connect to the platform.
                </p>

                <div className="space-y-4">
                    <WalletButton
                        onClick={() => connectWallet()} 
                        walletName="Starkey Wallet"
                        walletImage="/starkey.png"
                    />
                </div>
            </div>
        </div>
    );
};

export default Wallets;
