import { useSession } from "next-auth/react";
import { AtlassianSession } from "../pages/api/auth/[...nextauth]";
import { extractFromJiraAuth, jsonLog } from "@akfreas/tangential-core";

export function extractUserIdFromSession(session: any): string | null {
  if (!session || !isAtlassianSession(session)) {
    return null;
  }

  const { data } = session;

  const { atlassianUserId } = extractFromJiraAuth(data);
  return atlassianUserId;
}

export async function apiFetch(session: any, path: string, method: string = "GET", params: any = null) {

  // Check if session data is present and is of type AtlassianSession
  if (!session || !isAtlassianSession(session)) {
    console.error("apiFetch: session is null or not of type AtlassianSession");
    return null;
  }

  const { data: {accessToken, atlassianWorkspaceId, refreshToken} } = session;

  const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${path}`, {
    method,
    body: params ? JSON.stringify(params) : null,
    headers: {
      'X-Atlassian-Token': accessToken,
      'X-Atlassian-Workspace-Id': atlassianWorkspaceId,
      'X-Atlassian-Refresh-Token': refreshToken
    }
  });
  return result;
}

export async function nextApiFetch(session: any, path: string, method: string = "GET", params: any = null) {
  
  // Check if session data is present and is of type AtlassianSession
  if (!session || !isAtlassianSession(session)) {
    console.error("nextApiFetch: session is null or not of type AtlassianSession");
    return null;
  }

  const { data: {accessToken, atlassianWorkspaceId, refreshToken} } = session;

  const result = await fetch(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/api${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json' 
    },
    body: params ? JSON.stringify(params) : null,
  });
  return result;
}


// Type guard function to check if a session is of type AtlassianSession
function isAtlassianSession(session: any): session is {data: AtlassianSession} {
  return session.data?.accessToken !== undefined && 
    session.data?.atlassianWorkspaceId !== undefined && 
    session.data?.refreshToken !== undefined;
}
