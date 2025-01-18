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
  const ticker = searchParams.get('ticker');
  let sqlQuery = '';
  let sqlParams = [];

  if (name && ticker) {
    console.log(`Searching for name: ${name} and ticker: ${ticker}`);
    sqlQuery = `SELECT * FROM db_memes WHERE name ILIKE $1 AND ticker ILIKE $2 LIMIT 1`;
    sqlParams = [`%${name}%`, `%${ticker}%`];
  } else {
    return new Response(JSON.stringify({ error: 'Both name and ticker parameters are required' }), { status: 400 });
  }

  try {
    const result = await db.query(sqlQuery, sqlParams);
    return new Response(JSON.stringify(result.rows.length > 0 ? result.rows[0] : {}), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching meme' }), { status: 500 });
  }
}