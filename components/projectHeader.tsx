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
      'x-atlassian-token': accessToken,
      'x-atlassian-workspace-id': atlassianWorkspaceId,
      'x-atlassian-refresh-token': refreshToken
    }
  });
}

export default function ProjectHeader() {
  const session = useSession();
  console.log('session', session);
  return (
    <div className="flex flex-row justify-between mb-4">
      <Title>Programs</Title>

      <div className="flex flex-row space-x-2">
        <Button onClick={() => startAnalysis(session)}>Generate Report</Button>
        <Button onClick={() => startAnalysis(session)}>Analyze Projects</Button>
      </div>
    </div>
  );
}
