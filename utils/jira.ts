import { GetServerSidePropsContext, Metadata, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { axiosInstance, jsonGet } from "./request";
import { ResponseType } from "axios"; // import ResponseType from axios
import { doError, jsonLog } from "./logging";

interface AtlassianAuthenticatedRequestOptions {
  url: string;
  method: string;
  body?: any;
  responseType: ResponseType;
}

interface JiraRequestOptions {
  path: string;
  method: string;
  body: any;
}

interface Session {
  accessToken: string;
  atlassianId: string;
}

export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []): Promise<Session | null> {
  return getServerSession(...args, authOptions)
}

export async function makeAtlassianAuthenticatedRequest(options: AtlassianAuthenticatedRequestOptions, req: NextApiRequest, res: NextApiResponse): Promise<any> {

  const session: Session | null = await auth(req, res); // pass req and res
  if (session === null) {
    throw new Error("makeAtlassianAuthenticatedRequest: Authentication failed, session is null");
  }
  const { accessToken } = session;

  const response = await axiosInstance(options.url,
    {
    responseType: options.responseType,
    method: options.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // jsonLog("Response from atlassian", response)
  return response;
}

async function makeJiraRequest(options: JiraRequestOptions): Promise<any> {
  const session: Session | null = await auth();
  if (session === null) {
    throw new Error("makeJiraRequest: Authentication failed");
  } 

  const { accessToken, atlassianId } = session;

  const url = `https://api.atlassian.com/ex/jira/${atlassianId}/rest/api/3/${options.path}`;

  const response = await axiosInstance(url,
    {
    method: options.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });


  return response.data;
}

// Fetches the list of projects
async function fetchProjects() {
  const response = await makeJiraRequest({
    path: "project",
    method: "GET",
    body: null,
  });
  return response;
}

// Fetches the list of epics for a given project
async function fetchEpicsForProject(projectId: string) {
  const response = await makeJiraRequest({
    path: `search?jql=project=${projectId} AND issuetype=Epic`,
    method: "GET",
    body: null,
  });
  const { issues } = response;
  const epicsWithChanges = await Promise.all(issues.map(async (epic: any) => {
    const changes = await fetchChangesForIssue({ issueId: epic.id });
    return { ...epic, changes };
  }));
  return epicsWithChanges;
}

// Main function to fetch projects and their epics
export async function fetchProjectsAndEpics() {
  const projects = await fetchProjects();
  const projectsWithEpics = await Promise.all(projects.map(async (project: any) => {
    const epics = await fetchEpicsForProject(project.id);
    return {
      id: project.id,
      name: project.name,
      avatar: project.avatarUrls["48x48"],
      key: project.key,
      epics,
    };
  }));
  return projectsWithEpics;
}


export async function fetchChangesForIssue({ issueId }: { issueId: string }) {
  const response = await makeJiraRequest({
    path: `issue/${issueId}/changelog`,
    method: "GET",
    body: null,
  });
  return response;
}