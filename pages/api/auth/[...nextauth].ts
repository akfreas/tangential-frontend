import NextAuth, {
  NextAuthOptions,
  User, Session, Account, Profile, CallbacksOptions
} from 'next-auth';
import AtlassianProvider from 'next-auth/providers/atlassian';
import { axiosInstance, jsonGet, jsonPost } from '../../../utils/request';
import { httpAgent, httpsAgent } from '../../../config/config';
import { doDebug, doLog, jsonLog } from '@akfreas/tangential-core';
import { JWT } from 'next-auth/jwt';

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface RefreshedToken extends Token {
  error?: string;
}

export interface AtlassianSession extends Session {
  accessToken: string;
  atlassianId: string;
  refreshToken: string;
  accessTokenExpires?: number;
}

let refreshPromise: Promise<AtlassianJWT> | null = null;

async function refreshAtlassianAccessToken(token: AtlassianJWT): Promise<AtlassianJWT> {
  if (refreshPromise) {
    return await refreshPromise;
  }

  refreshPromise = new Promise<AtlassianJWT>(async (resolve, reject) => {
    try {
      const url = "https://auth.atlassian.com/oauth/token";
      const response = await axiosInstance.post(url, {
        grant_type: 'refresh_token',
        client_id: process.env.ATLASSIAN_CLIENT_ID,
        client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
        refresh_token: token.refreshToken,
      });

      const refreshedTokens = response.data;

      if (!refreshedTokens.access_token) {
        throw new Error('RefreshAccessTokenError: No access token in refresh response');
      }

      if (!refreshedTokens.refresh_token) {
        throw new Error('RefreshAccessTokenError: No refresh token in refresh response');
      }

      const refreshedToken: AtlassianJWT = {
        ...token,
        accessToken: refreshedTokens.access_token,
        refreshToken: refreshedTokens.refresh_token,
      };
      resolve(refreshedToken);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred:", error);
      }

      reject({
        ...token,
        error: "RefreshAccessTokenError",
      });
    } finally {
      refreshPromise = null;
    }
  });

  return await refreshPromise;
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
      const { token, account, profile, trigger } = params;
      // Check if the jwt callback is invoked for sign-in or sign-up
      //TODO: handle refresh Token

      if (trigger === 'signIn' || trigger === 'signUp') {
        if (account && profile) {
          const { access_token, refresh_token, expires_at } = account;
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
    async session(params) {

      const { session: s, token: t } = params;
      const token: AtlassianJWT = t as AtlassianJWT;
      const session: AtlassianSession = s as AtlassianSession;
      session.accessToken = token.accessToken;
      session.atlassianId = token.atlassianId;
      session.refreshToken = token.refreshToken;
      session.accessTokenExpires = token.accessTokenExpires;

      return session as AtlassianSession;
    }
  },
};

export default NextAuth(authOptions);
