import { Session } from "next-auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { axiosInstance } from "./request";
import { auth } from "./auth";
import { json } from "stream/consumers";
import { getSession } from "next-auth/react";
import { AtlassianSession } from "../pages/api/auth/[...nextauth]";
interface BackendAuthenticatedRequestOptions {
  path: string;
  method: string;
  body?: any;
}


export async function makeBackendAuthenticatedRequest(options: BackendAuthenticatedRequestOptions): Promise<any> {

  const session: AtlassianSession | null = await auth(); 
  if (session === null) {
    throw new Error("makeAtlassianAuthenticatedRequest: Authentication failed, session is null");
  }
  const { accessToken, atlassianWorkspaceId, refreshToken } = session;

  if (!accessToken || !atlassianWorkspaceId || !refreshToken) {
    throw new Error(`makeAtlassianAuthenticatedRequest: Authentication failed, missing ${!accessToken ? "accessToken": ""} ${!atlassianWorkspaceId ? "atlassianWorkspaceId" : ""} ${refreshToken ? "refreshToken" : ""}`);
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${options.path}`

  const response = await axiosInstance(url,
    {
      method: options.method,
      headers: {
        'x-atlassian-refresh-token': session.refreshToken,
        'x-atlassian-token': accessToken,
        'x-atlassian-workspace-id': atlassianWorkspaceId,
      },
    });
  return response;
}