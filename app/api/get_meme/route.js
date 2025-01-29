import { supabase } from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const symbol = searchParams.get('symbol');

  if (!name || !symbol) {
    return new Response(JSON.stringify({ error: 'Both name and symbol parameters are required' }), { status: 400 });
  }

  console.log(`Searching for name: ${name} and symbol: ${symbol}`);

  try {
    const { data, error } = await supabase
      .from('PoolsDB')
      .select('*')
      .ilike('name', `%${name}%`)
      .ilike('symbol', `%${symbol}%`)
      .limit(1)
      .maybeSingle(); // Evita que se rompa si no hay datos

    if (error) throw error;

    return new Response(JSON.stringify(data || {}), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching meme' }), { status: 500 });
  }
}
