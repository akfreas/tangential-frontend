import { getServerSession } from "next-auth";
import { AtlassianSession, authOptions } from "../pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext, Metadata, NextApiRequest, NextApiResponse } from "next";

export async function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []): Promise<AtlassianSession | null> {
  return getServerSession(...args, authOptions)
}
