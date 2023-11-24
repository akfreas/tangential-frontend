import { doError, extractFromJiraAuth, fetchAllReportTemplatesByOwnerAndPublic, jsonLog } from '@akfreas/tangential-core';
import { getSession } from 'next-auth/react';
import { AtlassianSession } from './auth/[...nextauth]';
import { auth } from '../../utils/auth';
import { NextApiRequest, NextApiResponse } from 'next';

// This function handles the API endpoint logic
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session: AtlassianSession | null = await auth(req, res); 
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { atlassianUserId} = extractFromJiraAuth(session);
    const templates = await fetchAllReportTemplatesByOwnerAndPublic(atlassianUserId);

    // Send a JSON response
    res.status(200).json(templates);
  } catch (error) {
    // Send an error response
    if (error instanceof Error) {
      doError("Error fetching templates", error);
    }
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
