import React, { useEffect, useState } from 'react';
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react';
import { redirect } from 'next/navigation';

import {
  extractFromJiraAuth,
  fetchLatestProjectReportsWithEpics,
  jsonLog,
} from '@akfreas/tangential-core';
import ProjectTable from '../components/projectTable';
import ProjectHeader from '../components/projectHeader';
import { auth } from '../utils/auth';
import { AtlassianSession } from '../pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { decode, getToken } from 'next-auth/jwt';
export const dynamic = 'force-dynamic';

export default async function ProgramsPage({}) {
  try {
    const session: AtlassianSession | null = await auth();
    if (session === null) {
      throw new Error(
        'makeAtlassianAuthenticatedRequest: Authentication failed, session is null',
      );
    }
    const { atlassianUserId } = extractFromJiraAuth(session);

    if (!atlassianUserId) {
      throw new Error(
        'makeAtlassianAuthenticatedRequest: Authentication failed, sub is null',
      );
    }

    const reports = await fetchLatestProjectReportsWithEpics(atlassianUserId);
    const needsFirstAnalysis = !reports || reports?.length === 0;

    return (
      <Card>
        <ProjectHeader />
        {!needsFirstAnalysis && <ProjectTable reports={reports} />}
        {needsFirstAnalysis && (
          <Card color='green'>
            {`To get started, you'll need to import your projects into Tangential by clicking "Analyze Projects"`}
            .
          </Card>
        )}
      </Card>
    );
  } catch (error) {
    console.error(error);
    return redirect('/');
  }
}
