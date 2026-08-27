import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const query = req.url?.split('?')[1] || '';
  const supabaseAuthCallback = `https://xeaifqmivirunbhfskeo.supabase.co/auth/v1/callback${query ? `?${query}` : ''}`;
  
  return res.redirect(307, supabaseAuthCallback);
}
