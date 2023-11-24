'use client';

import { Button, Card, Subtitle, Text, Title } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import { apiFetch, nextApiFetch } from "../utils/frontendRequest";
import { useSession } from "next-auth/react";
import { jsonLog } from "@akfreas/tangential-core";

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  audience: string;
  text: string;
  owner?: string;
  atlassianWorkspaceId: string;
}

export default function ReportWizard({ 
  showOverlay, setShowOverlay, selectedBuildId, projectName }
  : { showOverlay: boolean, setShowOverlay: (show: boolean) => void, selectedBuildId: string, projectName: string }) {
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [generateReport, setGenerateReport] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | undefined>(undefined); 
  const session = useSession();
  let contentRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {

    const closeOverlay = () => {
      setSelectedTemplate(undefined);
      setShowOverlay(false);
      setGenerateReport(false);
      contentRef.current?.remove();
    }
  
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        closeOverlay();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowOverlay]);

  useEffect(() => {
    const fetchTemplates = async () => {
      console.log('Fetching templates...');
      try {
        const templates: ReportTemplate[] | undefined = await (await nextApiFetch(session, '/listTemplates'))?.json();
        if (!templates) throw new Error('Failed to fetch templates');
        console.log('Templates:', templates);
        setReportTemplates(JSON.parse(JSON.stringify(templates)));
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, [session]); // re-run the effect if the session changes

  if (!showOverlay) return null;
  const cardStyle = {
    width: '500px',
    marginBottom: '10px',
  };

  const handleCardClick = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setGenerateReport(true);
  };

  const handleGenerateReport = async () => {
    if (contentRef.current) {
      contentRef.current.innerHTML = 'Report generation in progress, check the "reports" tab';
      await apiFetch(session, `/generateReport`, 'POST', {
        buildId: selectedBuildId,
        templateId: selectedTemplate?.id,
      });
      jsonLog("Generating report for build", {selectedBuildId, selectedTemplate});
    }
  };

  const svgChevron = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div ref={contentRef} className="w-1/2 aspect-square" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        {generateReport ? (
                          [<div key={"block"} className="h-full">
                            <Text>This will generate a text based report on the project {projectName} for {selectedTemplate?.audience}.</Text>
                          <div key="buttonContainer" className="mt-10 flex  flex-shrink-0 items-center">
                            

          <Button key={"generateReportButton"} 
          onClick={handleGenerateReport}>Generate Report</Button>
                          </div></div>]
        ) : (
          [<Title key={'selectTemplate'} className={'mb-20'}>Generate Report</Title>,
          <Subtitle key={'subtitle'}>Who is your audience?</Subtitle>,
          reportTemplates.map((template) => (
            <Card key={template.id} className={"mt-3"} onClick={() => handleCardClick(template)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>{template.audience}</p>
                {svgChevron}
              </div>
            </Card>
          ))]
        )}
      </div>
    </div>
  );
}
