import { Pool } from 'pg';

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_memes',
  password: '1M3M323_3-152G0553XD##',
  port: 5432,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const ticker = searchParams.get('ticker');
  const fee = searchParams.get('fee');
  const contract = searchParams.get('contract');
  const image = searchParams.get('image');
  const creator = searchParams.get('creator');
  const creation = searchParams.get('creation');
  const webpage = searchParams.get('webpage');
  const twitter = searchParams.get('twitter');
  const telegram = searchParams.get('telegram');
  const description = searchParams.get('description');
  const network = searchParams.get('network');

  try {
    console.log(name, "name memecoin");
    const uniqueId = contract + "_" + Date.now(); // Contrato + timestamp actual

    await db.query(
      'INSERT INTO db_memes(id, name, ticker, fee, contract, image, creator, creation, webpage, twitter, telegram, description, network) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
      [uniqueId, name, ticker, fee, contract, image, creator, creation, webpage, twitter, telegram, description, network]
    );

    return new Response(JSON.stringify({ message: 'Registrado con éxito' }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Error al registrar' }), { status: 500 });
  }
}

export async function POST(req) {
  return new Response('Method Not Allowed', { status: 405 });
}