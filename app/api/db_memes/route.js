import { supabase } from '@/lib/supabase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');

  let query = supabase.from('PoolsDB').select('*');

  if (search) {
    query = query.or(`name.ilike.%${search}%,symbol.ilike.%${search}%`).limit(3);
  } else {
    query = query.order('name', { ascending: true }).limit(10);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error fetching memes' }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
