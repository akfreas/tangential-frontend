import { Session } from "next-auth";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { axiosInstance } from "./request";
import { auth } from "./auth";
import { jsonLog } from "./logging";
import { json } from "stream/consumers";
import { getSession } from "next-auth/react";
interface BackendAuthenticatedRequestOptions {
  path: string;
  method: string;
  body?: any;
  responseType: ResponseType;
}

const baseBackendUrl = "http://localhost:3001"
export async function makeBackendAuthenticatedRequest(options: BackendAuthenticatedRequestOptions): Promise<any> {

  const session: Session | null = await auth(); // pass req and res
  if (session === null) {
    throw new Error("makeAtlassianAuthenticatedRequest: Authentication failed, session is null");
  }
  const { accessToken, atlassianId } = session;

  const url = `${baseBackendUrl}/${options.path}`

  const response = await axiosInstance(url,
    {
      responseType: options.responseType,
      method: options.method,
      headers: {
        'x-atlassian-token': accessToken,
        'x-atlassian-id': atlassianId,
      },
    });
  return response;
}