import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import Providers from 'next-auth/providers';
import { appConfig } from '@/lib/appConfig';
import { getAccessToken } from '@/lib/spotify';

interface JWT {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
  user: User;
  error?: string;
}

const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-currently-playing',
];

const refreshToken = async (token: JWT) => {
  try {
    const refreshedTokens = await getAccessToken(token.refreshToken);

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

const options: NextAuthOptions = {
  providers: [
    Providers.Spotify({
      clientId: appConfig.spotify.clientId,
      clientSecret: appConfig.spotify.clientSecret,
      scope: SPOTIFY_SCOPES.join(' '),
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // TODO: Figure out correct typings for token
    async jwt(token: any, user, account) {
      if (account && user) {
        return {
          accessToken: account.accessToken,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshToken(token);
    },
    // TODO: Figure out correct typings for session
    async session(session: any, token) {
      if (token) {
        return {
          user: token.user,
          accessToken: token.accessToken,
          error: token.error,
        };
      }

      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
