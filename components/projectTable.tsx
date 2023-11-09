'use client';

import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import ProjectRow from "./projectRow";
import { ProjectReport } from "@akfreas/tangential-core";

export default function ProjectTable({reports}: {reports: ProjectReport[]} ) {

  return (<Table className="mt-5">
  <TableHead>
    <TableRow>
      <TableHeaderCell>&nbsp;</TableHeaderCell>
      <TableHeaderCell>Program</TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
      <TableHeaderCell>Predicted End Date</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {reports?.map((project, index) => [
      <ProjectRow project={project} key={index} />
    ])}
  </TableBody>
  </Table>
)
}