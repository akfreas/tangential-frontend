import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Badge, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import { fetchProjectsAndEpics } from "../../utils/jira";
import { jsonLog } from "../../utils/logging";
import { redirect } from 'next/navigation'



export default async function ProgramsPage() {
  try {
    const data = await fetchProjectsAndEpics();
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Card>
          <Title>Table with Custom Columns</Title>
          <Table className="mt-5">
            <TableHead>
              <TableRow>
                <TableHeaderCell>Priority</TableHeaderCell>
                <TableHeaderCell>Program</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Life Cycle</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((issue, index) => (
                <TableRow key={index}>
                  <TableCell>{issue.fields.priority.name}</TableCell>
                  <TableCell>
                    <p>{issue.fields.summary}</p>
                  </TableCell>
                  <TableCell>
                    <Badge color="emerald">{issue.fields.status.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <p>{issue.fields.status.statusCategory.name}</p>
                  </TableCell>
                  <TableCell>
                    <p>{issue.fields.customfield_10015}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    );
  } catch (error) {
    return redirect('/signin');
  }
}
