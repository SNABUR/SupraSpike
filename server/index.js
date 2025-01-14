// Importar dependencias
const WebSocket = require("ws");
const fetch = require("node-fetch");

// Configurar el servidor WebSocket
const PORT = 8080; // Cambia el puerto si es necesario
const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor WebSocket escuchando en el puerto ${PORT}.`);

// Función para obtener eventos desde la API REST
async function fetchEvents(startBlock, endBlock) {
    const eventType = "0x6110f7805e01a3b4f90c1c7fb42a78c5790441a6a39b389aef0f39fd5185471d::pump_fa::deploy";

    try {
        const response = await fetch(`https://rpc-testnet.supra.com/rpc/v1/events/${eventType}?start=${startBlock}&end=${endBlock}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return null;
    }
}

// Manejar conexiones de clientes
wss.on("connection", (ws) => {
    console.log("Cliente conectado.");

    // Variables para el rango de bloques
    let startBlock = 7653174; // Bloque inicial
    let endBlock = startBlock + 1; // Bloque final inicial

    // Enviar datos al cliente en intervalos regulares
    const interval = setInterval(async () => {
        const events = await fetchEvents(startBlock, endBlock);
        if (events && events.length > 0) {
            console.log("Enviando eventos al cliente:", events);
            ws.send(JSON.stringify(events));
        }
        // Avanzar en el rango de bloques
        startBlock = endBlock;
        endBlock += 1;
    }, 5000); // Intervalo de 5 segundos

    // Manejar desconexión del cliente
    ws.on("close", () => {
        console.log("Cliente desconectado.");
        clearInterval(interval);
    });
});
