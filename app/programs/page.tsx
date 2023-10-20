import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Title } from "@tremor/react";
import { fetchEpicsByProject } from "../../utils/jira";
import { jsonLog } from "../../utils/logging";



export default async function ProgramsPage() {
  console.log("fetching epics");
  const projects = await fetchEpicsByProject();
  
  jsonLog('projects', projects)
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {Object.keys(projects).map(projectName => (
        <div key={projectName}>
          <Title>{projectName}</Title>
          <AccordionList className="mt-6">
            {projects[projectName].map(epic => (
              <Accordion key={epic.id}>
                <AccordionHeader>{epic.fields.summary}</AccordionHeader>
                <AccordionBody><p>{JSON.stringify(epic.fields.description.content)}</p></AccordionBody>
              </Accordion>
            ))}
          </AccordionList>
        </div>
      ))}
    </main>
  );

}
