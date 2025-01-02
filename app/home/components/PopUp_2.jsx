'use client';
import React, { useContext } from "react";


function PopUp_2({visible_2, onClose_2 }) {

    const handleOnClose_2 = (event) => {
        if (event.target.id === 'container_meme_created') onClose_2()
    };
    

    if (!visible_2) return null;

    return (
        <div
        id= 'container_meme_created'
        onClick={handleOnClose_2} 
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="bg-white p-2 rounded-2xl shadow-lg">
                    <div className="flex justify-end">
                    <button 
                        className="p-2 rounded-full h-10 w-10 flex justify-center bg-white border border-zinc-500 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        onClick={onClose_2}>
                        X
                    </button>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-auto h-96 bg-center bg-cover rounded-xl justify-center items-center p-4">
                            <img 

                                alt="Meme" 
                                className="w-full h-full object-contain cursor-pointer"
                            />

                        </div>
                        <div className="text-center mt-4">
                            <p className="text-lg font-semibold">Congrats!!</p>
                            <p className="text-lg">Your meme has been born!!</p>
                            <p className="text-lg">Contract:</p>
                            {Network === "Solana" ? (
                            <a href={`https://solscan.io/token/`+currentMemeContract} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-semibold mb-2 px-4 text-left text-gray-700">{currentMemeContract}
                            </a>
                            ): Network === "Ethereum" ? (
                                <a href={`https://etherscan.io/`+currentMemeContract} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-semibold mb-2 px-4 text-left text-gray-700">{currentMemeContract}
                            </a>
                            
                            ): Network === "TON" ? (
                                <a href={`https://tonscan.org/jetton/`+currentMemeContract} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-semibold mb-2 px-4 text-left text-gray-700">{currentMemeContract}
                            </a>     

                            ):(
                                <a href={`https://etherscan.io/`+currentMemeContract} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-semibold mb-2 px-4 text-left text-gray-700">{currentMemeContract}
                            </a>

                            )}
                            
                        </div>
                    </div>
                    {Network !== "Solana" && Network !== "TON" && (

                    <div className="flex flex-col justify-center items-center animate-bounce">
                        <button 
                            onClick={() => add_metamask(currentMemeContract, currentMemeImage)}
                            className="flex items-center justify-center px-4 py-3 animate-pulse text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50">
                            <img  alt="Metamask" className="justify-center w-8 h-8 "/>
                        </button>
                        <p>Add to metamask!</p>
                    </div>
                    )}
                </div>
                </div>

        </div>
    )
}
export default PopUp_2;