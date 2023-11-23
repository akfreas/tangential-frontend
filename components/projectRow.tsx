'use client';
import React, { useState } from 'react';
import { EpicReport, ProjectReport, jsonLog } from '@akfreas/tangential-core';
import {
  Badge,
  Bold,
  Button,
  TableCell,
  TableRow
} from '@tremor/react';
import ItemCategoryBar from './itemCategoryBar';

export default function ProjectRow({ project }: { project: ProjectReport }) {
  const [areEpicsVisible, setAreEpicsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const toggleEpics = () => {
    setAreEpicsVisible(!areEpicsVisible);
  };

  const startReportGeneration = () => {
    // Add your logic for report generation here
    console.log("Generating report for", project.projectKey);
  };
  return [
    <TableRow 
      key={project.projectKey} 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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
        <div onClick={toggleEpics} className="flex-col justify-center items-center w-100">
        {areEpicsVisible ?
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
          :  
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    
        }
      </div>
      </TableCell>
      <TableCell width={300}>
        <p className="break-words">{project.summary?.shortSummary}</p>
      </TableCell>
      <TableCell width={300}>
        <p className="break-words">{project.summary?.shortSummary}</p>
      </TableCell>
      <TableCell width={300}>
        <p className="break-words">{project.summary?.shortSummary}</p>
      </TableCell>
      
      <TableCell width={350}>
        {isHovering && (
          <Button onClick={startReportGeneration}>
            Generate Report
          </Button>
        )}
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
