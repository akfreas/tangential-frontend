'use client';
import React, { useState } from 'react';
import { ProjectReport, jsonLog } from '@akfreas/tangential-core';
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
    </TableRow>,

    // Only render the epic rows if areEpicsVisible is true
    areEpicsVisible &&
      project.epics.map((epic) => (
        <TableRow key={epic.epicKey}>
          <TableCell></TableCell>
          <TableCell>
            <Bold>{epic.summary}</Bold>
            <p>{epic.assignee ? epic.assignee?.displayName : "No Assignee"} </p>
          </TableCell>
          <TableCell>
            {epic.totalPoints > 0 &&
            <p><Badge color={epic.analysis?.state?.color}>
              {epic.analysis?.state?.name}
            </Badge>
            
            <ItemCategoryBar 
            completed={epic.completedPoints} 
            inProgress={epic.inProgressPoints} 
            remaining={epic.remainingPoints} 
            total={epic.totalPoints} />
            </p>}
          </TableCell>
          <TableCell className='whitespace-normal'>
          <p className='break-words'>{epic.summaryText}</p>
          </TableCell>
          <TableCell>
          <Badge color={epic.analysis?.state?.color}>{epic.analysis?.predictedEndDate}</Badge>
          </TableCell>
        </TableRow>
      ))
  ];
}
