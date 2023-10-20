// pages/api/imageProxy.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { axiosInstance } from '../../utils/request';
// List of allowed domains
const allowedDomains: string[] = ['example.com', 'another-example.com'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (!allowedDomains.includes(urlObj.hostname)) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }

  try {
    const response = await axiosInstance.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
    return res.end(buffer);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch image' });
  }
}
