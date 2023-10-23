import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Badge, Card, Table, TableBody, 
  TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";
import { fetchProjectsAndEpics } from "../../utils/jira";
import { jsonLog } from "../../utils/logging";
import { redirect } from 'next/navigation'

import Image from 'next/image';
import { jsonGet } from "../../utils/request";

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
                <TableHeaderCell>Img</TableHeaderCell>
                <TableHeaderCell>Key</TableHeaderCell>
                <TableHeaderCell>Program</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Life Cycle</TableHeaderCell>
                <TableHeaderCell>Due Date</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((project, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {/* <Image src={`https://tangential.eu.ngrok.io/api/atlassianProxy?url=${project.avatar}`}
                  width={50}
                  height={50} 
                  alt={project}/> */}
                  <img src={`https://tangential.eu.ngrok.io/api/atlassianProxy?url=${project.avatar}`} 
                        width="50" 
                        height="50" 
                        alt={project}
                        crossOrigin="use-credentials" />
                  </TableCell>
                  <TableCell>
                    <p>{project.key}</p>
                  </TableCell>
                  <TableCell>
                    <p>{project.name}</p>
                  </TableCell>
                  <TableCell>
                  </TableCell>
                  <TableCell>
                    <p></p>
                  </TableCell>
                </TableRow>
              ))}
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
