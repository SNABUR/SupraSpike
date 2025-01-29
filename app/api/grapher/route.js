import { supabase } from '@/lib/supabase';

export async function POST(req) {
  // Leer los datos de la solicitud
  const { tokenAddress, limit = 100 } = await req.json();

  const { data, error } = await supabase
    .from('TradeEvent')
    .select(`
      timestamp,
      virtualSupraReserves,
      virtualTokenReserves
    `)
    .eq('tokenAddress', tokenAddress)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  // Asegurar que data sea un array antes de mapearlo
  const processedData = (data || []).map((trade) => ({
    ...trade,
    timestamp: trade.timestamp * 1000, // Convertir de segundos a milisegundos
  }));

  return new Response(JSON.stringify(processedData), { status: 200 });
}
