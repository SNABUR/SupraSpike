import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true'
  });

  try {
    const supabase = createRouteHandlerClient({});
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return new NextResponse(
        JSON.stringify({ error: 'Requiere autenticación' }),
        { status: 401, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get('address');
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      return new NextResponse(
        JSON.stringify({ error: 'Dirección inválida' }),
        { status: 400, headers }
      );
    }

    const payload = {
      sub: session.user.id,
      aud: 'supabase',
      exp: Math.floor(Date.now() / 1000) + 3600, 
      allowed_token: tokenAddress
    };

    const token = jwt.sign(
      payload,
      process.env.SUPABASE_JWT_SECRET,
      { algorithm: 'HS256' }
    );

    return new NextResponse(
      JSON.stringify({ token }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Error interno:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error del servidor' }),
      { status: 500, headers }
    );
  }
}