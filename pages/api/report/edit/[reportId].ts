import { getSession } from "next-auth/react";
import {
  TextReport,
  deleteTextReportById,
  doError,
  jsonLog,
  updateTextReport,
} from "@akfreas/tangential-core";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../../utils/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Retrieve the session
  jsonLog("req", req.body);
  const session = await auth(req, res);
  const { body } = req;
  if (!body) {
    return res.status(400).json({ error: "Body is required" });
  }

  if (!body.id) {
    return res.status(400).json({ error: "Report ID is required" });
  }
  // if (body.id !== req.query.reportId) {
  //   return res
  //     .status(400)
  //     .json({ error: "Report ID in body does not match report ID in URL" });
  // }
  // Check if there is a session
  if (!session) {
    // If there's no session, return a 401 Unauthorized response
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { reportId } = req.query;
  console.log("Deleting report with id", reportId);

  const updatedReport = {
    text: body.text,
    name: body.name,
    description: body.description,
  };

  try {
    await updateTextReport(
      reportId as string,
      updatedReport.text,
      updatedReport.name,
      updatedReport.description
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      doError("Error updating report", error);
    }
    res.status(500).json({ error: "Error editing report" });
  }
  res.status(200).json({ success: true });
}
