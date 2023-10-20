import { getToken } from "next-auth/jwt";
import { authOptions } from "../auth/[...nextauth]"
import { getServerSession } from "next-auth";

export default async function handler(req, res) {

  const session = await getToken({req, raw: true})

  console.log("server session", req)

  res.status(200).json({ name: 'John Doe' })
}