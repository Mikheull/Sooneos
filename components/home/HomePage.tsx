import {SpotifyProfile} from '@/models/Spotify';
import { Fragment } from 'react';
import useSWR from 'swr';
import { APIRoute } from '@/models/APIRoute.enum';
import HomeHeader from '@/components/home/HomeHeader';
import LyricsCard from '@/components/LyricsCard';

interface Props {
  isLoading?: boolean;
}

interface ProfileResponse {
  profile: SpotifyProfile;
}

const HomePage: React.FC<Props> = () => {
  const { data } = useSWR<ProfileResponse>(APIRoute.PROFILE);

  return (
    <Fragment>
      <HomeHeader
        isLoading={!data}
        profile={data?.profile}
      />

      <div className="px-6 mx-auto lg:px-16 h-auto">
        <div className="mt-32 mb-16 text-center mx-auto px-4">
            <h1 className="font-semibold text-5xl text-gray-700">Hello <span className="text-lyrics-600 font-bold">{data?.profile.display_name}</span></h1>
            <p className="mt-2 text-2xl text-gray-600">Ready to sing until the end of the night?</p>
            <p className="text-md text-gray-600">Once the music is full loaded, click on the image</p>
        </div>
      </div>

      <LyricsCard />
    </Fragment>
  );
};

export default HomePage;
