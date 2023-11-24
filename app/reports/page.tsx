import {
  TextReport,
  extractFromJiraAuth,
  fetchTextReportsByOwner,
} from "@akfreas/tangential-core";
import { Card, Title } from "@tremor/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { AtlassianSession } from "../../pages/api/auth/[...nextauth]";
import { extractUserIdFromSession } from "../../utils/frontendRequest";
import { auth } from "../../utils/auth";
import ReportComponent from "./reportComponent";

export default async function TextReportsPage() {
  const session: AtlassianSession | null = await auth();
  if (session === null) {
    throw new Error(
      "makeAtlassianAuthenticatedRequest: Authentication failed, session is null",
    );
  }
  const { atlassianUserId } = extractFromJiraAuth(session);
  if (!atlassianUserId) {
    throw new Error("No Atlassian user ID found");
  }
  const textReports = await fetchTextReportsByOwner(atlassianUserId);

  if (!textReports) {
    throw new Error("Failed to fetch text reports");
  }

  return (
    <div className="w-2/3 mx-auto mt-8">

      {textReports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        [
        <ul key={'reports-list'} className="space-y-4">
          {textReports.map((report) => (
            <ReportComponent key={report.id} {...report} /> 
          ))}
        </ul>
        ]
      )}
    </div>
  );
}
