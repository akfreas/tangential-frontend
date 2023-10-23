import NextAuth, {
  NextAuthOptions, JWT,
  User, AdapterUser, Session } from 'next-auth';
import AtlassianProvider from 'next-auth/providers/atlassian';
import { axiosInstance, jsonGet, jsonPost } from '../../../utils/request';
import { httpAgent, httpsAgent } from '../../../config/config';
import { doDebug, jsonLog } from '../../../utils/logging';

/**
 * Takes a token, and returns a new token with an updated
 * `accessToken`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAtlassianAccessToken(token) {
  try {
    const url = "https://auth.atlassian.com/oauth/token";
    const response = await axiosInstance.post(url, {
      grant_type: 'refresh_token',
      client_id: process.env.ATLASSIAN_CLIENT_ID,
      client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
      refresh_token: token.refreshToken,
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
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
      //TODO: handle refresh token

      if (trigger === 'signIn' || trigger === 'signUp') {
        if (account && profile) {
          const id = profile.id;
          const {access_token, refresh_token, expires_at } = account;
          const resourceUrl = "https://api.atlassian.com/oauth/token/accessible-resources";
          const [{ id: atlassianId }] = await jsonGet({
            url: resourceUrl,
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });
          token.accessToken = access_token;
          token.refreshToken = refresh_token;
          token.atlassianId = atlassianId;
          token.accessTokenExpires = expires_at * 1000;
        }
      }

      // If the token has expired, refresh it
      if (token.accessToken && Date.now() > token.accessTokenExpires) {
        doDebug("Refreshing access token because it has expired", token.accessTokenExpires, Date.now(), Date.now() > token.accessTokenExpires ? "expired" : "not expired");
        return refreshAtlassianAccessToken(token);
      }

      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.atlassianId = token.atlassianId;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
};

export default NextAuth(authOptions);
