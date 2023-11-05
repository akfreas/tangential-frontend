import { ProjectReport, MongoDBWrapper, doLog } from "@akfreas/tangential-core";
import { report } from "process";

export async function fetchAllProjectReports(): Promise<ProjectReport[] | null> {
  try {
    const dbWrapper = await MongoDBWrapper.getInstance(process.env.MONGODB_URI, process.env.MONGODB_DATABASE);
    const reportsCollection = dbWrapper.getCollection<ProjectReport>('reports');
    // Fetching all reports from the database
    const reportsArray = await reportsCollection.find().toArray();
    if (!reportsArray || reportsArray.length === 0) {
      console.log('No reports found.');
      return null;
    }

    // let mappedReports: any = {};
    // reportsArray.forEach((report: ProjectReport) => {
    //   mappedReports[report.projectKey] = report;
    // })

    console.log('Successfully fetched all project reports.');
    return reportsArray;
  } catch (error) {
    doLog(`Failed to fetch reports: ${error}`);
    return null;
  }
};