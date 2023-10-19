import NextAuth, { NextAuthOptions } from 'next-auth';
import AtlassianProvider from 'next-auth/providers/atlassian';

export const authOptions: NextAuthOptions = {
  providers: [
    AtlassianProvider({
      clientId: process.env.ATLASSIAN_CLIENT_ID,
      clientSecret: process.env.ATLASSIAN_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:jira-work read:jira-user offline_access read:me"
        }
      }
    })
  
  ],
};

export default NextAuth(authOptions);
