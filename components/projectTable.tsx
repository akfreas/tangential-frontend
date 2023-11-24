'use client';

import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import ProjectRow from "./projectRow";
import { ProjectReport } from "@akfreas/tangential-core";
import { useState } from "react";

export default function ProjectTable({reports}: {reports: ProjectReport[]} ) {

  const [areEpicsVisible, setAreEpicsVisible] = useState(false);

  return (<Table className="mt-5 ">
  <TableHead>
    <TableRow>
      <TableHeaderCell>&nbsp;</TableHeaderCell>
      <TableHeaderCell>Program</TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
      <TableHeaderCell >{areEpicsVisible && "Predicted End Date"}</TableHeaderCell>
      <TableHeaderCell >{areEpicsVisible && "Long Running Issues"}</TableHeaderCell>
      <TableHeaderCell></TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody >
    {reports?.map((project, index) => [
      <ProjectRow project={project} key={index} areEpicsVisible={areEpicsVisible} setAreEpicsVisible={setAreEpicsVisible} />,
    ])}
  </TableBody>
  </Table>
)
}