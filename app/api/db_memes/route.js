// app/api/db_memes/route.js
import { Pool } from 'pg';

const db = new Pool({
  user: process.env.USER_DB_POSTGRES,
  host: process.env.HOST_DB_POSTGRES,
  database: process.env.DATABASE_DB_POSTGRES,
  password: process.env.PASSWORD_DB_POSTGRES,
  port: process.env.PORT_DB_POSTGRES,
  //user: 'postgres',
  //host: 'localhost',
  //database: 'db_memes',
  //password: '1M3M323_3-152G0553XD##',
  //port: 5432,
});

export async function GET(req) {
  const { search } = req.nextUrl.searchParams;
  let sqlQuery = '';
  let sqlParams = [];

  if (search) {
    sqlQuery = `SELECT * FROM db_memes WHERE name ILIKE $1 OR contract ILIKE $1 LIMIT 3`;
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
