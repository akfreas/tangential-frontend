#!/usr/bin/env node

import { NextApiRequest, NextApiResponse } from 'next';
import { axiosInstance } from '../../utils/request';
import { makeAtlassianAuthenticatedRequest } from '../../utils/jira';
import { IncomingHttpHeaders } from 'http';
import { doError } from '@akfreas/tangential-core';

// List of allowed domains
const allowedDomains: string[] = ['api.atlassian.com'];

// Helper to filter headers
function filterHeaders(headers: IncomingHttpHeaders) {
  const allowedHeaders = ['content-type'];
  const filtered: { [key: string]: string | string[] | undefined } = {};

  for (const key of allowedHeaders) {
    if (headers[key]) {
      filtered[key] = headers[key];
    }
  }

  return filtered;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (typeof url !== 'string') {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  if (!allowedDomains.includes(urlObj.hostname)) {
    res.status(403).json({ error: 'Domain not allowed' });
    return;
  }

  try {
    const { data, headers } = await makeAtlassianAuthenticatedRequest(
      { url, method: 'get', responseType: 'arraybuffer' }, req, res
    );

    const filteredHeaders = filterHeaders(headers);
    res.writeHead(200, filteredHeaders);
    res.end(data);
    return;
  } catch (error: unknown) { // specify the error type as 'unknown'
    if (error instanceof Error) { // use a type guard to narrow down the type
      doError("Error fetching", error);
    } else {
      throw error;
    }
    res.status(500).json({ error: 'Failed to fetch data from atlassian' });
    return;
  }
}

// Make sure to add `responseType: 'arraybuffer'` in `makeAtlassianAuthenticatedRequest` axios request options.
