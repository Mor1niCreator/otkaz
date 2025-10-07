import type { NextApiRequest, NextApiResponse } from 'next';
import { getCryptoROI } from '@/lib/crypto-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.query;

    if (!amount) {
      return res.status(400).json({ error: 'Amount required' });
    }

    const usdAmount = parseFloat(amount as string);
    const cryptoData = await getCryptoROI(usdAmount);

    return res.status(200).json({ data: cryptoData });
  } catch (error) {
    console.error('Crypto ROI error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}