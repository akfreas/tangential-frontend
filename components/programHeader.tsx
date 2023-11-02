'use client';

import { Button, Title } from '@tremor/react';
import React from 'react';
import { makeBackendAuthenticatedRequest } from '../utils/backendUtils';
import { useSession } from 'next-auth/react';

async function startAnalysis(session: any) {
  const {
    data: { accessToken, atlassianId }
  } = session;
  console.log('session', session);
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/workspace/analyze`, {
    method: 'GET',
    headers: {
      'x-atlassian-token': accessToken,
      'x-atlassian-id': atlassianId
    }
  });
}

export default function ProgramsHeader() {
  const session = useSession();
  console.log('session', session);
  return (
    <div className="flex flex-row justify-between">
      <Title>Programs</Title>
      <Button onClick={() => startAnalysis(session)}>Analyze Projects</Button>
    </div>
  );
}
