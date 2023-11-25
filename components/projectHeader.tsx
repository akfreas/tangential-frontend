'use client';

import { Button, Card, Title, TextInput } from '@tremor/react';
import React, { useState } from 'react';
import { makeBackendAuthenticatedRequest } from '../utils/backendUtils';
import { useSession } from 'next-auth/react';
import { apiFetch, nextApiFetch } from '../utils/frontendRequest';

export default function ProjectHeader() {
  const session = useSession();
  const [buttonState, setButtonState] = useState({
    color: '',
    loading: false,
    text: 'Analyze Projects',
  });
  const [jqlQuery, setJqlQuery] = useState(''); // State for JQL Query
  const [name, setName] = useState(''); // State for Name

  async function startAnalysis(session: any) {
    setButtonState({
      color: 'green',
      loading: true,
      text: 'Currently Analyzing',
    }); // Set state for analyzing
    const {
      data: { accessToken, atlassianWorkspaceId, refreshToken },
    } = session;
    console.log('session', session);

    await apiFetch(session, `/workspace/analyze`)
      .then(() => {
        // No state update here to keep the button green until page refresh
      })
      .catch(() => {
        setButtonState({ color: 'red', loading: false, text: 'Error' }); // Set state for error
      });
  }

  function handleSubmit() {
    nextApiFetch(session, '/projectDefinition/create', 'POST', {
      jqlQuery,
      name,
    })
      .then((res) => {
        return res?.json();
      })
      .then((data) => {
        console.log(data);
        setName('');
        setJqlQuery('');
      });
  }

  return (
    <div className='flex flex-row justify-between mb-4'>
      <Title>Programs</Title>

      <div className='flex flex-row space-x-2 items-center'>
        <TextInput
          placeholder='JQL Query'
          value={jqlQuery}
          onChange={(e) => setJqlQuery(e.target.value)}
        />
        <TextInput
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
        <Button
          loading={buttonState.loading}
          style={{ backgroundColor: buttonState.color }}
          onClick={() => startAnalysis(session)}
        >
          {buttonState.text}
        </Button>
      </div>
    </div>
  );
}
