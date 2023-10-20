import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Title } from "@tremor/react";
import { fetchEpics } from "../../utils/jira";



export default async function ProgramsPage() {
  console.log("fetching epics");
  const epics = await fetchEpics();
  console.log("epics", epics)
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Programs</Title>
      <AccordionList className="mt-6">
        <Accordion>
          <AccordionHeader>Hey</AccordionHeader>„
          <AccordionBody>How is it going</AccordionBody>
        </Accordion>
        <Accordion>
          <AccordionHeader>Yo</AccordionHeader>
          <AccordionBody>
            It is going good, how about you?
          </AccordionBody>
        </Accordion>
      </AccordionList>
    </main>
  );
}
