import React from "react";
import Image from "next/image";

interface WalletButtonProps {
    onClick: () => void;
    walletName: string;
    walletImage: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({ onClick, walletName, walletImage }) => {
    return (
        <button
            className="flex items-center w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={onClick}
        >
            <Image
                src={walletImage}
                width={32}
                height={32}
                alt={walletName}
                className="w-8 h-8 mr-4"
            />
            <span className="text-gray-800 font-medium">{walletName}</span>
        </button>
    );
};

export default WalletButton;
