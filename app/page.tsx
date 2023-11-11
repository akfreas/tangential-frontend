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
  Title
} from '@tremor/react';
import { redirect } from 'next/navigation';

import { fetchAllProjectReports, jsonLog } from '@akfreas/tangential-core';
import ProjectTable from '../components/projectTable';
import ProjectHeader from '../components/projectHeader';
import { auth } from '../utils/auth';
import { AtlassianSession } from '../pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { decode, getToken } from 'next-auth/jwt';
import {decodeJwt}  from 'jose';
export const dynamic = 'force-dynamic';

export default async function ProgramsPage({}) {
  try {
    const session: AtlassianSession | null = await auth(); 
    if (session === null) {
      throw new Error("makeAtlassianAuthenticatedRequest: Authentication failed, session is null");
    }
    const { accessToken } = session;
    const {sub} = decodeJwt(accessToken);

    if (!sub) {
      throw new Error("makeAtlassianAuthenticatedRequest: Authentication failed, sub is null");
    }

    const report = await fetchAllProjectReports(sub);
    const needsFirstAnalysis = !report || report?.length === 0;
  
    return (
      <main className="p-4 md:p-10 mx-auto max-w-screen-2xl">
        <Card>
          <ProjectHeader/>
          {!needsFirstAnalysis && <ProjectTable reports={report} />}
          {needsFirstAnalysis && (
            <Card color='green'>{`To get started, you'll need to import your projects into Tangential by clicking "Analyze Projects"`}.</Card>
          )}
        </Card>
      </main>
    );
  } catch (error) {
    console.error(error);
    return redirect('/');
  }
}
