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

import { fetchAllProjectReports } from '../utils/analysisAccess';
import ProgramsHeader from '../components/projectHeader';
import { SessionProvider } from 'next-auth/react';
import ProjectRow from '../components/projectRow';
import { jsonLog } from '@akfreas/tangential-core';
import ProjectTable from '../components/projectTable';
import ProjectHeader from '../components/projectHeader';
export const dynamic = 'force-dynamic';

export default async function ProgramsPage({}) {
  try {
    const report = await fetchAllProjectReports();
    const needsFirstAnalysis = !report || report?.length === 0;
  
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
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
