"use-client";
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
            className="fixed z-40 inset-0 bg-[#131722] bg-opacity-90 backdrop-blur-md flex justify-center items-center"
        >
            <div className="w-96 bg-gradient-to-br from-[#1D2A3A] to-[#131722] rounded-3xl shadow-2xl p-8 relative overflow-hidden border border-[#353F4A]">
                {/* Fondo decorativo */}
                <div className="absolute inset-0 bg-noise opacity-10"></div>

                {/* Encabezado */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#DD1438] to-[#FF6B6B]">
                        Connect Wallet
                    </h2>
                    <button
                        onClick={onCloseWallets}
                        className="text-[#9EABB5] hover:text-[#E2E6E6] transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Descripción */}
                <p className="text-sm text-[#9EABB5] mb-8 relative z-10">
                    Select your wallet to connect to the Supra blockchain and unlock the power of decentralized data.
                </p>

                {/* Botones de wallets */}
                <div className="space-y-4 relative z-10">
                    <WalletButton
                        onClick={() => connectWallet()}
                        walletName="Starkey Wallet"
                        walletImage="/starkey.png"
                    />
                </div>

                {/* Efecto de brillo */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#DD1438] rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#1D2A3A] rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                </div>

                {/* Supra Branding */}
                <div className="mt-8 text-center relative z-10">
                    <p className="text-xs text-[#6A737C]">
                        Powered by <span className="text-[#DD1438] font-semibold">Supra</span> | Move VM Blockchain
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Wallets;