import { ProjectReport } from '@akfreas/tangential-core';
import { Badge, TableCell, TableHeaderCell, TableRow } from '@tremor/react';
import { jsonLog } from '../utils/logging';

export default function ProjectRow(project: ProjectReport) {
  jsonLog(project.epics);
  return [
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
        <p>
          {project.name}
          <br />
          {project.projectKey}
          <br />
        </p>
      </TableCell>
      <TableCell>
        <Badge>{project.active == true ? 'Active' : 'Inactive'}</Badge>
      </TableCell>
      <TableCell>
        <p>{project.summaryStatus}</p>
      </TableCell>
      <TableCell>
        <p>{project.velocity}</p>
      </TableCell>
      <TableCell>
        <p></p>
      </TableCell>
    </TableRow>,

    ...project.epics.map((epic) => (
      <TableRow key={epic.epicKey}>
        <TableCell></TableCell>
        <TableCell>
          <p>{epic.summary}</p>
        </TableCell>
        <TableCell>
          <Badge>{epic.statusName}</Badge>
        </TableCell>
        <TableCell>
          <p>{epic.summaryStatus}</p>
        </TableCell>
        <TableCell>
          <p>{epic.velocity}</p>
        </TableCell>
        <TableCell>
          <p></p>
        </TableCell>
      </TableRow>
    ))
  ];
}
