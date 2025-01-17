// app/api/db_memes/route.js
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
  const search = searchParams.get('search');
  let sqlQuery = '';
  let sqlParams = [];

  if (search) {
    console.log(search, "search params")
    sqlQuery = `SELECT * FROM db_memes WHERE name ILIKE $1 OR ticker ILIKE $1 LIMIT 3`;
    const searchPattern = '%' + search + '%';
    sqlParams = [searchPattern];
  } else {
    sqlQuery = `SELECT * FROM db_memes ORDER BY name ASC LIMIT 10`;
  }

  try {
    const result = await db.query(sqlQuery, sqlParams);
    return new Response(JSON.stringify(result.rows.length > 0 ? result.rows : []), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching memes' }), { status: 500 });
  }
}
