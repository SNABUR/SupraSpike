import { Pool } from 'pg';

const db = new Pool({
  user: process.env.USER_DB_POSTGRES,
  host: process.env.HOST_DB_POSTGRES,
  database: process.env.DATABASE_DB_POSTGRES,
  password: process.env.PASSWORD_DB_POSTGRES,
  port: parseInt(process.env.PORT_DB_POSTGRES, 10),
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token_contract = searchParams.get('token_contract');

  if (token_contract) {
    console.log(`Searching for data: ${token_contract}`);
    const sqlQuery = `
      SELECT timestamp, "virtualSupraReserves", "virtualTokenReserves"
      FROM "TradeEvent"
      WHERE "tokenAddress" = $1
      ORDER BY timestamp ASC
      LIMIT 100
    `;
    const sqlParams = [token_contract];

    try {
      const result = await db.query(sqlQuery, sqlParams);
      const rows = result.rows;

      // Calcular el precio y agrupar por intervalos de 5 minutos
      const ohlcData = calculateOHLC(rows);

      return new Response(JSON.stringify(ohlcData), { status: 200 });
    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response(JSON.stringify({ error: 'Error fetching data' }), { status: 500 });
    }
  } else {
    return new Response(JSON.stringify({ error: 'token_contract parameter is required' }), { status: 400 });
  }
}

function calculateOHLC(rows) {
  const ohlcData = [];
  let currentInterval = null;
  let open = null;
  let high = null;
  let low = null;
  let close = null;

  rows.forEach((entry) => {
    const timestamp = entry.timestamp;
    const virtualTokenReserves = entry.virtualTokenReserves;
    const virtualSupraReserves = entry.virtualSupraReserves;
    const price = virtualSupraReserves / virtualTokenReserves; // Calcular el precio correctamente

    // Cambiar a intervalos de 5 minutos (300,000 ms)
    const interval = Math.floor(timestamp * 1000 / (5 * 60 * 1000)) * (5 * 60 * 1000);

    if (currentInterval === null || interval !== currentInterval) {
      if (currentInterval !== null) {
        ohlcData.push({ time: currentInterval, open, high, low, close });
      }
      currentInterval = interval;
      open = price;
      high = price;
      low = price;
      close = price;
    } else {
      if (price > high) high = price;
      if (price < low) low = price;
      close = price;
    }
  });

  if (currentInterval !== null) {
    ohlcData.push({ time: currentInterval, open, high, low, close });
  }

  return ohlcData;
}
