'use client';
import React, { useState } from 'react';
import { EpicReport, ProjectReport, jsonLog } from '@akfreas/tangential-core';
import {
  Badge,
  Bold,
  CategoryBar,
  TableCell,
  TableHeaderCell,
  TableRow
} from '@tremor/react';
import ItemCategoryBar from './itemCategoryBar';

export default function ProjectRow({ project }: { project: ProjectReport }) {
  const [areEpicsVisible, setAreEpicsVisible] = useState(false);

  const toggleEpics = () => {
    setAreEpicsVisible(!areEpicsVisible);
  };

  return [
    <TableRow key={project.projectKey} onClick={toggleEpics}>
      <TableCell width={75} >
        <img
          src={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api/atlassianProxy?url=${project.avatar}`}
          width="50"
          height="50"
          alt={project.projectKey}
          crossOrigin="use-credentials"
        />
      </TableCell>
      <TableCell width={150}>
        <p>
          <Bold>{project.name}</Bold>
          <br />
          {project.lead.displayName}
          <br />
        </p>
      </TableCell>
      <TableCell width={100} className="flex justify-center items-center">
        {project.analysis !== undefined ? (
          <Badge color={project.analysis?.state?.color}>
            {project.analysis?.state?.name}
          </Badge>
        ) : null}
        <ItemCategoryBar
      completed={project.completedPoints}
      inProgress={project.inProgressPoints}
      remaining={project.remainingPoints}
      total={project.totalPoints}/>
      </TableCell>

      <TableCell>
        <p>{project.summaryStatus}</p>
      </TableCell>
    </TableRow>
  ];
}
