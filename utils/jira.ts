import { GetServerSidePropsContext, Metadata, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]"
import { axiosInstance, jsonGet } from "./request";

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

async function makeJiraRequest(options: JiraRequestOptions): Promise<any> {
  const session: Session | null = await auth();
  if (session === null) {
    throw new Error("Authentication failed");
  } 

  // console.log("session", session);
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
export async function fetchEpicsByProject() {

  const response = await makeJiraRequest({
    path: "search?jql=issuetype=Epic",
    method: "GET",
    body: null,
  });
  const { issues } = response;
  // Group epics by project
  const projects = {};
   issues.forEach(epic => {
    const projectName = epic.fields.project.name;
    if (!projects[projectName]) {
      projects[projectName] = [];
    }

    projects[projectName].push(epic);
  });
  return projects;
}