import { getProfile } from '@/lib/spotify';
import { isBadStatusCode } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  const [
    profileResponse
  ] = await Promise.all([
    getProfile(session.accessToken)
  ]);

  if (
    isBadStatusCode(profileResponse)
  ) {
    return res.status(400).json({
      error: 'Failed to get spotify user profile.',
    });
  }

  const [profile, following, playlists] = await Promise.all([
    profileResponse.json()
  ]);

  return res.status(200).json({
    profile,
    followingCount: 0,
    playlistCount: 0,
  });
};
