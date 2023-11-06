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
import ProgramsHeader from '../components/programHeader';
import { SessionProvider } from 'next-auth/react';
import ProjectRow from '../components/projectRow';
export const dynamic = 'force-dynamic';

export default async function ProgramsPage({}) {
  try {
    const report = await fetchAllProjectReports();

    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Card>
          <ProgramsHeader />
          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>&nbsp;</TableHeaderCell>
                <TableHeaderCell>Program</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>Velocity</TableHeaderCell>
                <TableHeaderCell>Life Cycle</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report?.map((project, index) => [
                <ProjectRow project={project} key={index} />
              ])}
            </TableBody>
          </Table>
        </Card>
      </main>
    );
  } catch (error) {
    console.error(error);
    return redirect('/');
  }
}
