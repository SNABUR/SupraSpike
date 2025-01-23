"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from 'next/link';
import Image from 'next/image';
//import { useRouter } from 'next/router';

//import { dbMemesPoint } from '../../../utils/axiossonfig'; // Importa la configuración de Axios

//import no_image from "../../../../images/no_image.png";
//import metamask from "../../../../images/metamask.svg";
//import etherscan from "../../../../images/etherscan_logo.svg";
//import copy_logo from "../../../../images/copy.svg";

const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

const LoadingBox = () => (
    <div className="border border-gray-300 rounded-3xl shadow-sm overflow-hidden bg-white bg-opacity-80" style={{ width: '300px', height:'550px' }}>
        <div className="flex flex-col items-center animate-pulse p-5 ">
            <div className="flex border justify-center border-gray-300 rounded-3xl shadow-sm overflow-hidden bg-white bg-opacity-50" style={{ width: '200px', height:'200px' }}></div>
            <p className="text-lg font-semibold text-center mt-auto mb-auto p-4">loading...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
            <p className="text-md font-semibold text-center mt-auto mb-auto">SPIN SPIN...</p>
        </div>
    </div>
);

const Meme_Search = () => {
    //const router = useRouter();
    const [memes, setMemes] = useState([]);
    const [search, setSearch] = useState("");
    const [scalingButtons, setScalingButtons] = useState({});
    const [loading, setLoading] = useState(true);

    const MAX_RETRIES = 3; // Número máximo de intentos
    const RETRY_DELAY = 3000; // Retraso entre intentos (en milisegundos)
    
    const fetchDataWithRetry = async (retries = MAX_RETRIES) => {
        setLoading(true); // Establecer el estado de carga al inicio de la solicitud
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/db_memes`  );
            console.log(response, "response data");
    
            // Verifica que la respuesta sea exitosa (status 200)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json(); // Solo parsea JSON si la respuesta fue exitosa
            setMemes(data);
            console.log(data, "all meme data");
        } catch (error) {
            console.error('Error fetching memes:', error);
            if (retries > 0) {
                console.log(`Reintentando... Quedan ${retries} intentos`);
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY)); // Esperar antes de reintentar
                return fetchDataWithRetry(retries - 1); // Volver a llamar a la función
            } else {
                console.log("Se han agotado todos los reintentos. No se pudo obtener los datos.");
            }
        } finally {
            setLoading(false); // Dejar de mostrar el estado de carga
        }
    };
    
        
    useEffect(() => {
        setLoading(true);
        fetchDataWithRetry();
    }, []);
    

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleButtonClick = (contract) => {
        setScalingButtons(prevState => ({
            ...prevState,
            [contract]: true
        }));

        navigator.clipboard.writeText(contract)
            .then(() => {
                console.log('Contract copied to clipboard:', contract);
            })
            .catch((error) => {
                console.error('Error copying contract to clipboard:', error);
            })
            .finally(() => {
                setTimeout(() => {
                    setScalingButtons(prevState => ({
                        ...prevState,
                        [contract]: false
                    }));
                }, 400); // Duración de la animación en milisegundos
            });
    };
    

    
    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/db_memes?search=${encodeURIComponent(search)}`);
            console.log(response, "response data handle search");
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json(); // Solo parsea JSON si la respuesta fue exitosa
            // Actualizar el estado 'memes' con los resultados de la búsqueda
            setMemes(data);
        } catch (error) {
            console.error('Error fetching memes:', error);
        }
    };

    const searcher = (e) => {
        setSearch(e.target.value);
    };

    let results = [];
    if (!search) {
        results = memes;
    } else {
        results = memes.filter((meme) =>
            meme.name && meme.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    return (
        <div className="flex flex-col px-3 justify-center" > {/* Fondo cálido */}
            <div className="rounded-2xl ">

            <div className="flex flex-col items-center p-3 md:p-8 shadow-xl transition duration-300 hover:shadow-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-goldeng text-white mb-1 text-center  rounded-xl md:text-left">TOP PROJECTS</h1>

                <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-screen-lg rounded-lg p-4 md:p-3 shadow-md">
                    <div className="flex flex-col md:flex-row items-center w-full p-2 md:p-4 rounded-lg">
                        <input
                            value={search}
                            onChange={searcher}
                            type="text"
                            onKeyDown={handleKeyPress}
                            placeholder="Search for memes..."
                            className="form-control block w-full text-base sm:text-lg px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:outline-none focus:ring focus:ring-orange-300 focus:border-orange-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="mt-5 md:mt-0 md:ml-4 bg-amber-400 text-brown-900 hover:bg-orange-600 text-black font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div className="rounded-3xl flex flex-wrap gap-3 justify-center items-start p-1">
                { loading ? (
                    <>
                        <LoadingBox />
                        <LoadingBox />
                        <LoadingBox />
                    </>
                ) : (
                results.map((meme) => (
                    <div key={meme.id} className="flex flex-col border border-gray-400 px-3 md:px-1 font-role rounded-xl md:rounded-3xl p-1 md:p-1 shadow-sm overflow-hidden bg-white w-72 ">
                        <div className="flex flex-row md:flex-col">
                        <Link
                            href={{
                                pathname: `/Degen/${meme.name}-${meme.symbol}`,
                                //query: { meme: JSON.stringify(meme) }
                            }}
                        >
                            <div className="p-3 cursor-pointer mb-3">
                            <Image 
                                className="w-full max-h-56 sm:max-h-64 md:max-h-72 lg:max-h-80 object-contain rounded-3xl" 
                                src={isValidUrl(meme.image) ? meme.image : "/no_image.jpg"} 
                                alt={meme.name} 
                                layout="responsive"
                                width={500} // Ajusta el ancho según tus necesidades
                                height={300} // Ajusta la altura según tus necesidades
                            />
                            </div>
                        </Link>
                            <div className="flex flex-col px-3 space-y-1 md:mb-3 md:space-y-2">
                                <h1 className="text-md md:text-xl font-semibold text-start text-black max-h-12 overflow-hidden text-ellipsis md:max-h-8">
                                    {meme.name}
                                </h1>
                                <div className="flex justify-between items-center text-sm">
                                    <h1 className="text-xs font-semibold text-gray-700">Ticker: {meme.symbol}</h1>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <h1 className="font-semibold text-gray-700">Contract: {meme.tokenAddress?.slice(0, 6)}...{meme.tokenAddress?.slice(-4)}</h1>
                                    <button 
                                        onClick={() => handleButtonClick(meme.tokenAddress)}
                                        className={`flex font-semibold ${scalingButtons[meme.tokenAddress] ? 'animate-scale-down' : ''}`}>
                                        <Image 
                                        src={"/copy.svg"} 
                                        alt="copy_logo"
                                        className="w-4 md:w-5" 
                                        width={20}
                                        height={20}
                                        />
                                    </button>
                                </div>
                                <div className="text-xs font-semibold text-gray-700">Red: Supra
                                    {/*meme.network*/}
                                    </div>
                                {/*<h1 className="text-center text-xs text-gray-700 p-2">{meme.description}</h1>*/}
                                <div className="flex justify-between items-center text-xs mb-2">
                                    <a href={`https://testnet.suprascan.io/address/${meme.tokenAddress}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 font-semibold">Created by: {meme.dev?.slice(0, 6)}...{meme.dev?.slice(-4)}</a>
                                    <a href={`https://testnet.suprascan.io/address/${meme.tokenAddress}`} target="_blank" rel="noopener noreferrer">
                                        <Image 
                                        src={"/supra.svg"} 
                                        alt="etherscan" 
                                        width={20}
                                        height={20}
                                        className="w-5 md:w-5"
                                         />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            </div>
            </div>
        </div>
    );
}

export default Meme_Search;
