'use client';

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';
import ProjectRow from './projectRow';
import { ProjectReport } from '@akfreas/tangential-core';
import { useState } from 'react';

export default function ProjectTable({
  reports,
}: {
  reports: ProjectReport[];
}) {
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {},
  );
  const toggleRow = (projectKey: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [projectKey]: !prev[projectKey],
    }));
  };

  const anyRowExpanded = Object.values(expandedRows).some((value) => value);

  return (
    <Table className='mt-5 '>
      <TableHead>
        <TableRow>
          <TableHeaderCell>&nbsp;</TableHeaderCell>
          <TableHeaderCell>Program</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
          <TableHeaderCell>
            {anyRowExpanded && 'Predicted End Date'}
          </TableHeaderCell>
          <TableHeaderCell>
            {anyRowExpanded && 'Long Running Issues'}
          </TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {reports?.map((project) => (
          <ProjectRow
            project={project}
            key={project.projectDefinitionId}
            isExpanded={expandedRows[project.projectDefinitionId]}
            toggleRow={() => toggleRow(project.projectDefinitionId)}
          />
        ))}
      </TableBody>
    </Table>
  );
}
