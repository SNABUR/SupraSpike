import { Pool } from 'pg';

const db = new Pool({
  user: process.env.USER_DB_POSTGRES,
  host: process.env.HOST_DB_POSTGRES,
  database: process.env.DATABASE_DB_POSTGRES,
  password: process.env.PASSWORD_DB_POSTGRES,
  port: process.env.PORT_DB_POSTGRES,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const symbol = searchParams.get('symbol');
  let sqlQuery = '';
  let sqlParams = [];

  if (name && symbol) {
    console.log(`Searching for name: ${name} and symbol: ${symbol}`);
    sqlQuery = `SELECT * FROM "PoolsDB" WHERE name ILIKE $1 AND symbol ILIKE $2 LIMIT 1`;
    sqlParams = [`%${name}%`, `%${symbol}%`];
  } else {
    return new Response(JSON.stringify({ error: 'Both name and symbol parameters are required' }), { status: 400 });
  }

  try {
    const result = await db.query(sqlQuery, sqlParams);
    return new Response(JSON.stringify(result.rows.length > 0 ? result.rows[0] : {}), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching meme' }), { status: 500 });
  }
}