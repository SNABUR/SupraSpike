const WebSocket = require("ws");
const fetch = require("node-fetch");

const PORT = 8080; 
const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor WebSocket escuchando en el puerto ${PORT}.`);

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

wss.on("connection", (ws) => {
    console.log("Cliente conectado.");

    let startBlock = 7653174; 
    let endBlock = startBlock + 1; 

    const interval = setInterval(async () => {
        const events = await fetchEvents(startBlock, endBlock);
        if (events && events.length > 0) {
            console.log("Enviando eventos al cliente:", events);
            ws.send(JSON.stringify(events));
        }
        startBlock = endBlock;
        endBlock += 1;
    }, 5000); 

    ws.on("close", () => {
        console.log("Cliente desconectado.");
        clearInterval(interval);
    });
});
