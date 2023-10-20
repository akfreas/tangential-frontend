import NextAuth, { NextAuthOptions, JWT, User, AdapterUser, Session } from 'next-auth';
import AtlassianProvider from 'next-auth/providers/atlassian';

// Your jsonGet function
async function jsonGet({ url, headers }: { url: string, headers: Record<string, string> }) {
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  return await response.json();
}

export const authOptions: NextAuthOptions = {
  providers: [
    AtlassianProvider({
      clientId: process.env.ATLASSIAN_CLIENT_ID!,
      clientSecret: process.env.ATLASSIAN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:jira-work read:jira-user offline_access read:me"
        }
      }
    }),
  ],
  callbacks: {
    async jwt(params: { token: JWT, user?: User | AdapterUser, account?: { access_token: string }, profile?: any, trigger?: "signIn" | "signUp" | "update" }) {
      const { token, user, account, profile, trigger } = params;
      // Check if the jwt callback is invoked for sign-in or sign-up
      if (trigger === 'signIn' || trigger === 'signUp') {
        if (account && profile) {
          const id = profile.id;
          const access_token = account.access_token;
          const resourceUrl = "https://api.atlassian.com/oauth/token/accessible-resources";
          console.log("Fetching resource url", resourceUrl)
          const [{ id: atlassianId }] = await jsonGet({
            url: resourceUrl,
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          console.log("jira id", atlassianId)
          token.accessToken = access_token;
          // Persist the id and any other needed data to the token
          token.atlassianId = atlassianId;
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      // Make data available to the client
      session.accessToken = token.accessToken;
      session.atlassianId = token.atlassianId;
      return session;
    },
  },
};

export default NextAuth(authOptions);
