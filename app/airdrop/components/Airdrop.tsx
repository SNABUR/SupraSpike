"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useGetAirdropTransaction from "../../hooks/getAirdrop";
import  { useWallet }  from "@/app/context/walletContext";

const Airdrop = () => {
  const [step, setStep] = useState(0); // Controla el progreso de los pasos
  const [showPopup, setShowPopup] = useState(false); // Controla la visibilidad del popup
  const { getTokens, isLoading, error, result } = useGetAirdropTransaction();
  const { changeNetworkSupra } = useWallet(); // Obtén el provider desde el contexto

  useEffect(() => {
    if (result) {
        setShowPopup(true);
    }
  }, [result]);

  const steps = [
    {
      text: "Follow us on Twitter",
      link: "https://x.com/supra_spikes",
      icon: "./twitter.svg", // Ruta del ícono

    },
    {
      text: "Like & Retweet",
      link: "https://x.com/supra_spike/status/1870090839483122010",
      icon: "./retweet.svg", // Ruta del ícono

    },
    {
      text: "Claim Airdrop",
      action: getTokens, // Llama a la función getTokens
      icon: null, // Sin ícono para este botón

    },
  ];


  return (
    <div className="flex flex-col items-center justify-center mt-7 mb-7 text-gray-800">
      <div className="text-center space-y-4">
        {steps.map((stepData, index) => (
          <div key={index}>
            {index < steps.length - 1 ? (
              // Botones Minimalistas para "Follow" y "Like & Retweet"
              <button
                onClick={() => {
                  window.open(stepData.link, "_blank"); // Abre el enlace
                  setStep(step + 1); // Avanza al siguiente paso
                }}
                disabled={false} // Siempre habilitado
                className={`flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-full border focus:outline-none transition-all ${
                  step === index
                    ? "border-purple-500 bg-purple-600 text-white hover:bg-purple-500"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                {stepData.icon && (
                  <Image src={stepData.icon} alt={stepData.text} width={20} height={20} className="invert"/>
                )}
                <span>{stepData.text}</span>
              </button>
            ) : (
              // Botón Llamativo para "Claim Airdrop"
              <button
                onClick={() => {
                  if (stepData.action) stepData.action();
                }}
                disabled={false || isLoading}
                className={`w-full max-w-lg px-8 py-4 rounded-xl font-semibold text-xl tracking-wide transition-all transform focus:outline-none shadow-lg ${
                  step === index
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 hover:shadow-2xl active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3 animate-pulse">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span className="text-lg font-medium">Processing...</span>
                  </div>
                ) : (
                  <span>{stepData.text}</span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
      {showPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" 
          onClick={() => setShowPopup(false)} // Cierra el popup al hacer clic fuera del contenido
        >
          <div 
            className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm w-full"
            onClick={(e) => e.stopPropagation()} // Evita que el click dentro del popup cierre el modal
          >
            {/* Título del popup */}
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-green-600">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-700">
                You just got <span className="text-purple-600 font-bold">1,000,000 SPIKE tokens!</span>
              </p>
            </div>

            {/* Imagen opcional para reforzar el mensaje del meme */}
            <div className="mt-4">
              <img 
                src="https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif" 
                alt="Celebration meme" 
                className="mx-auto rounded-lg shadow-lg w-48"
              />
            </div>

            {/* Enlace a los detalles de la transacción */}
            <div className="mt-6">
              <a
                href={`https://suprascan.io/tx/${result}/f?tab=tx-advance`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700 transition"
              >
                🔗 View transaction details
              </a>
            </div>

            {/* Botón para cerrar el popup */}
            <div className="mt-6">
              <button
                onClick={() => setShowPopup(false)}
                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default Airdrop;
