'use client';

import { Button, Card, Title } from '@tremor/react';
import React, { useState } from 'react';
import { makeBackendAuthenticatedRequest } from '../utils/backendUtils';
import { useSession } from 'next-auth/react';

export default function ProjectHeader() {
  const session = useSession();
  const [buttonState, setButtonState] = useState({ color: '', text: 'Analyze Projects' });

  console.log('session', session);

  async function startAnalysis(session: any) {
    setButtonState({ color: 'green', text: 'Currently Analyzing' }); // Set state for analyzing
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
    }).then(() => {
      // No state update here to keep the button green until page refresh
    }).catch(() => {
      setButtonState({ color: 'red', text: 'Error' }); // Set state for error
    });
  }

  return (
    <div className="flex flex-row justify-between mb-4">
      <Title>Programs</Title>

      <div className="flex flex-row space-x-2">
        <Button
          style={{ backgroundColor: buttonState.color }}
          onClick={() => startAnalysis(session)}
        >
          {buttonState.text}
        </Button>
      </div>
    </div>
  );
}
