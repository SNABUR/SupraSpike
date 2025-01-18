'use client';
import React from "react";
import Image from 'next/image';
import Link from 'next/link';

function PopUp_2({ onClose_2, visible_2, memedata, image }) {

    const handleOnClose_2 = (event) => {
        if (event.target.id === 'container_meme_created') onClose_2();
    };

    if (!visible_2) return null;

    const { MemeName, Symbol, telegram, twitter, website } = memedata || {};

    return (
        <div
            id='container_meme_created'
            onClick={handleOnClose_2}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
        >
            
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="flex justify-end">
                        <button
                            className="p-2 rounded-full h-10 w-10 flex justify-center bg-white border border-zinc-500 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            onClick={onClose_2}
                        >
                            X
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold">Congrats!!</p>
                        <p className="text-lg">Your meme has been born!!</p>
                       <div className="w-auto h-96 bg-center bg-cover rounded-xl justify-center items-center p-4">
                            <Link href={`/Degen/${MemeName}-${Symbol}`}>
                                <Image
                                    src={image ? image : "/no_image.jpg"}
                                    width={300}
                                    height={300}
                                    alt="Meme"
                                    className="w-full h-full object-contain cursor-pointer rounded-xl"
                                />
                            </Link>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-2xl font-bold">Name: {MemeName}</p>
                            <p className="text-xl text-gray-600">Symbol: {Symbol}</p>
                            <a
                                href={`https://solscan.io/token/${memedata.contract}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold mb-2 px-4 text-left text-blue-600 hover:underline"
                            >
                                {memedata.contract}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopUp_2;