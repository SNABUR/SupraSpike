import { supabase } from '@/lib/supabase';

export async function POST(req) {
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

  const processedData = (data || []).map((trade) => ({
    ...trade,
    timestamp: trade.timestamp * 1000, 
  }));

  return new Response(JSON.stringify(processedData), { status: 200 });
}
