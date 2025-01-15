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

export async function POST(req) {
  try {
    // Lee el cuerpo de la solicitud
    const body = await req.json();  // Deserializa el cuerpo JSON
    
    const { 
      memeName, 
      memeSymbol, 
      contractmeme, 
      CID, 
      mainAcc, 
      data_creation, 
      website, 
      twitter, 
      telegram, 
      description, 
      network, 
      uri, 
      tx 
    } = body;  // Desestructura los valores enviados desde el frontend

    const uniqueId = contractmeme + "_" + Date.now(); // Contrato + timestamp actual

    await db.query(
      'INSERT INTO db_memes(id, name, ticker, contract, image, creator, creation, webpage, twitter, telegram, description, network, uri, txhash) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      [uniqueId, memeName, memeSymbol, contractmeme, CID, mainAcc, data_creation, website, twitter, telegram, description, network, uri, tx]
    );

    return new Response(JSON.stringify({ message: 'Registrado con éxito' }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Error al registrar' }), { status: 500 });
  }
}

export async function GET(req) {
  return new Response('Method Not Allowed', { status: 405 });
}
