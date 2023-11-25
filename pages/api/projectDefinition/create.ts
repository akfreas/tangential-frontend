import { ProjectDefinition, createProjectDefinition, extractFromJiraAuth } from '@akfreas/tangential-core';
import { NextApiRequest, NextApiResponse } from 'next';
import { AtlassianSession } from '../auth/[...nextauth]';
import { auth } from '../../../utils/auth';
import { createHash } from 'crypto';

interface CreateReportDefinitionRequest {
  jqlQuery: string;
  name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { jqlQuery, name } = req.body as CreateReportDefinitionRequest;

    // Handle the API request here
    // You can access the request body using req.body
    // You can send a response using res.json() or res.send()

    // Example: Send a JSON response

    const session: AtlassianSession | null = await auth(req, res); 
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!jqlQuery) {  
      return res.status(400).json({ error: 'JQL Query is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const { atlassianUserId} = extractFromJiraAuth(session);
    const regex = /project\s*=\s*(?:"([^"]+)"|'([^']+)'|(\S+))/;
    const matches = jqlQuery.match(regex);
    const associatedProjectKey = matches ? matches[1] : undefined;
    const projectDefinition: ProjectDefinition = {
      jqlQuery,
      owner: atlassianUserId,
      name,
      associatedProjectKey,
      id: createHash('sha256').update(`${atlassianUserId}_${jqlQuery}`).digest('hex'),
    }

    await createProjectDefinition(projectDefinition);

    res.status(200).json(projectDefinition);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
