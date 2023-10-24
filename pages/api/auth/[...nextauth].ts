import NextAuth, {
  NextAuthOptions, 
  User, Session, Account, Profile, CallbacksOptions } from 'next-auth';
import AtlassianProvider from 'next-auth/providers/atlassian';
import { axiosInstance, jsonGet, jsonPost } from '../../../utils/request';
import { httpAgent, httpsAgent } from '../../../config/config';
import { doDebug, jsonLog } from '../../../utils/logging';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface RefreshedToken extends Token {
  error?: string;
}

async function refreshAtlassianAccessToken(token: AtlassianJWT): Promise<AtlassianJWT> {
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
  } catch (error: unknown) { // specify the error type as 'unknown'
    if (error instanceof Error) { // use a type guard to narrow down the type
      console.log(error.message);
    } else {
      console.log("An unknown error occurred:", error);
    }
    
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

  interface AtlassianJWT extends JWT {
    accessToken: string,
    refreshToken: string,
    atlassianId: string,
    accessTokenExpires: number,
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
    async jwt(params) {
      const { token, user, account, profile, trigger } = params;
      // Check if the jwt callback is invoked for sign-in or sign-up
      //TODO: handle refresh token

      if (trigger === 'signIn' || trigger === 'signUp') {
        if (account && profile) {
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
          token.accessTokenExpires = expires_at ? expires_at * 1000 : undefined;
        }
      }

      // If the token has expired, refresh it
      if (token.accessToken && typeof token.accessTokenExpires === 'number' && Date.now() > token.accessTokenExpires) {
        doDebug("Refreshing access token because it has expired", token.accessTokenExpires, Date.now(), Date.now() > token.accessTokenExpires ? "expired" : "not expired");
        return refreshAtlassianAccessToken(token as AtlassianJWT);
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
