import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Title } from "@tremor/react";
import { fetchEpicsByProject } from "../../utils/jira";
import { jsonLog } from "../../utils/logging";



export default async function ProgramsPage() {
  console.log("fetching epics");
  const projects = await fetchEpicsByProject();
  
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {Object.keys(projects).map(projectName => (
        <div key={projectName}>

      <AccordionList className="mt-6">
        <Accordion key={projectName}>
          <AccordionHeader>{projectName}</AccordionHeader>
            <AccordionBody><p>{projects[projectName].length}</p></AccordionBody>
        </Accordion>
      </AccordionList>
        </div>
      ))}
    </main>
  );

}
