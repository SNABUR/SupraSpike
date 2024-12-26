"use client";

import { useState } from "react";
import { AptosClient } from "aptos";

const RPC_URL = "https://rpc-wallet-mainnet.supra.com/"; // URL del cliente RPC
const client = new AptosClient(RPC_URL);

export default function Profile() {
  const [resources, setResources] = useState<any[]>([]); // Estado para almacenar los recursos
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [debugData, setDebugData] = useState<string | null>(null); // Para depuración de respuesta cruda

  const getAccountResources = async (accountAddress: string) => {
    setLoading(true);
    setError(null);
    setDebugData(null);

    try {
      const resources = await client.getAccountResources(accountAddress);

      // Guardar los datos de los recursos
      setResources(resources);

      // Guardar los datos para depuración en formato legible
      setDebugData(JSON.stringify(resources, null, 2));
    } catch (err) {
      setError("Error al obtener los recursos. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4">
      <h1 className="text-2xl font-bold">Detalles de la Cuenta</h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() =>
          getAccountResources(
            "0xe675d42e9c16f1dc9578427d9885211b3e484707a6b18aee44a547b7c3d8e4a2"
          )
        }
      >
        Obtener Recursos de la Cuenta
      </button>

      {/* Indicador de carga */}
      {loading && <p className="text-gray-500">Cargando...</p>}

      {/* Mensaje de error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Mostrar recursos obtenidos */}
      {resources.length > 0 && (
        <div className="bg-gray-100 p-4 rounded shadow-md w-3/4 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Recursos:</h2>
          <ul className="space-y-2">
            {resources.map((resource, index) => (
              <li key={index} className="text-sm text-gray-700">
                <strong>Tipo:</strong> {resource.type}
                <br />
                <strong>Datos:</strong> {JSON.stringify(resource.data, null, 2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bloque de depuración */}
      {debugData && (
        <div className="bg-yellow-100 p-4 rounded shadow-md w-3/4 max-h-[400px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2 text-yellow-600">
            Datos de depuración (JSON):
          </h2>
          <pre className="text-sm text-gray-800">{debugData}</pre>
        </div>
      )}
    </div>
  );
}
