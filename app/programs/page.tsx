import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionList,
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title
} from '@tremor/react';
import { PlayIcon } from '@heroicons/react/24/solid';

import { fetchProjectsAndEpics } from '../../utils/jira';
import { jsonLog } from '../../utils/logging';
import { redirect } from 'next/navigation';

import Image from 'next/image';
import { jsonGet } from '../../utils/request';
import { makeBackendAuthenticatedRequest } from '../../utils/backendUtils';
import { fetchAllProjectReports } from '../../utils/analysisAccess';
export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  try {
    const report = await fetchAllProjectReports();
    jsonLog('report', report);

    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Card>
          <div className="flex flex-row justify-between">
            <Title>Programs</Title>
            <Button>Analyze Projects</Button>
          </div>
          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Img</TableHeaderCell>
                <TableHeaderCell>Key</TableHeaderCell>
                <TableHeaderCell>Program</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Life Cycle</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.map((project, index) => [
                <TableRow key={project.projectKey}>
                  <TableCell>
                    <img
                      src={`${process.env.DEPLOYMENT_URL}/api/atlassianProxy?url=${project.avatar}`}
                      width="50"
                      height="50"
                      alt={project.projectKey}
                      crossOrigin="use-credentials"
                    />
                  </TableCell>
                  <TableCell>
                    <p>{project.key}</p>
                  </TableCell>
                  <TableCell>
                    <p>{project.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
                  </TableCell>
                  <TableCell>
                    <p></p>
                  </TableCell>
                </TableRow>
                // report[project.key].epics.map((epic, index) => (
                //   <TableRow key={epic.epicKey}>
                //     <TableCell>&nbsp;</TableCell>
                //     <TableCell>
                //       <p>{epic.epicKey}</p>
                //     </TableCell>
                //     <TableCell>
                //       <p>{epic.velocity}</p>
                //     </TableCell>
                //     <TableCell></TableCell>
                //     <TableCell>
                //       <p></p>
                //     </TableCell>
                //   </TableRow>
                // ))
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
