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
          <Bold>{project.title}</Bold>
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
        <p>{project.statusName}</p>
      </TableCell>
    </TableRow>,

    // Only render the epic rows if areEpicsVisible is true
    areEpicsVisible && project.epics && project.epics.length > 0 &&
    project.epics.map((epic) => (
        <TableRow key={epic.key}>
          <TableCell></TableCell>
          <TableCell>
            <Bold>{epic.title}</Bold>
            <p>{epic.assignee ? epic.assignee?.displayName : "No Assignee"} </p>
          </TableCell>
          <TableCell className="flex justify-center items-center">
  <div className="flex-col justify-center items-center w-100">
    {epic.totalPoints > 0 ?
      <>
        <Badge color={epic.analysis?.state?.color ?? "yellow"}>
          {epic.analysis?.state?.name ?? "No Status"}
        </Badge>
        <ItemCategoryBar
          completed={epic.completedPoints} 
          inProgress={epic.inProgressPoints} 
          remaining={epic.remainingPoints} 
          total={epic.totalPoints} />
      </>
    : <Badge color={"yellow"}>
    {"No Status"}
  </Badge>
}
  </div>
</TableCell>

          <TableCell className='whitespace-normal'>
          <p className='break-words'>{epic.summary?.shortSummary}</p>
          </TableCell>
          <TableCell>
          <Badge color={epic.analysis?.state?.color}>{epic.analysis?.predictedEndDate ?? "No Date"}</Badge>
          </TableCell>
          <TableCell>
            <Badge color={epic.longRunningIssues.length / epic.childIssues.length > 0.1 ? "red" : "green"}>{epic.longRunningIssues?.length}</Badge>
          </TableCell>
        </TableRow>
      ))
  ];
}
