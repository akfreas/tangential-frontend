'use client';

import { Button, Card, Title } from '@tremor/react';
import React from 'react';
import { makeBackendAuthenticatedRequest } from '../utils/backendUtils';
import { useSession } from 'next-auth/react';

async function startAnalysis(session: any) {
  const {
    data: { accessToken, atlassianWorkspaceId, refreshToken }
  } = session;
  console.log('session', session);
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/workspace/analyze`, {
    method: 'GET',
    headers: {
      'X-Atlassian-Token': accessToken,
      'X-Atlassian-Workspace-Id': atlassianWorkspaceId,
      'X-Atlassian-Refresh-Token': refreshToken
    }
  });
}

async function showReportWizard(session: any) {
}

export default function ProjectHeader() {
  const session = useSession();
  console.log('session', session);
  return (
    <div className="flex flex-row justify-between mb-4">
      <Title>Programs</Title>

      <div className="flex flex-row space-x-2">
        <Button onClick={() => showReportWizard(session)}>Generate Report</Button>
        <Button onClick={() => startAnalysis(session)}>Analyze Projects</Button>
      </div>
    </div>
  );
}
