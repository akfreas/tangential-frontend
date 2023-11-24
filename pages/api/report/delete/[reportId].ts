import { getSession } from 'next-auth/react';
import { deleteTextReportById, jsonLog } from '@akfreas/tangential-core';
import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '../../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Retrieve the session
  jsonLog('req', req.query)
  const session = await auth(req, res);

  // Check if there is a session
  if (!session) {
    // If there's no session, return a 401 Unauthorized response
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { reportId } = req.query;
  console.log("Deleting report with id", reportId);

  try {
    await deleteTextReportById(reportId as string);
  } catch (error: unknown) {
    res.status(500).json({ error: 'Error deleting report' });
  }
  res.status(200).json({ success: true });
}
