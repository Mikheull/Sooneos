import {SpotifyProfile} from '@/models/Spotify';
import { Fragment } from 'react';
import useSWR from 'swr';
import { APIRoute } from '@/models/APIRoute.enum';
import HomeHeader from '@/components/home/HomeHeader';
import LyricsCard from '@/components/LyricsCard';

import { faGit, faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

      <div className="min-h-screen">
        <div className="px-6 mx-auto lg:px-16 h-auto">
          <div className="mt-32 mb-16 text-center mx-auto px-4">
              <h1 className="font-semibold text-5xl text-gray-700">Hello <span className="text-c-primary font-bold">{data?.profile.display_name}</span></h1>
              <p className="mt-2 text-2xl text-gray-600">Ready to sing until the end of the night?</p>
              <p className="text-md text-gray-600">Once the music is full loaded, click on the image</p>
          </div>
        </div>

        <LyricsCard />
      </div>

      <footer className="w-full bottom-0 bg-gray-900">
        <div className="container mx-auto p-8">
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-8/12 px-4">
              <div className="text-sm text-white font-semibold py-1">
                <p className="text-white text-sm font-semibold py-1" >© { new Date().getFullYear() } <a href="https://mikhaelbailly.fr" target="blank">Mikhaël Bailly</a></p>
              </div>
            </div>
            <div className="w-full md:w-4/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li> <a href="https://github.com/Mikheull" target="blank" title="My Github account" className="text-white hover:text-gray-400 text-sm block py-1 px-3"> <FontAwesomeIcon icon={faGithub} /> </a> </li>
                <li> <a href="https://twitter.com/Mikhael_Bailly" target="blank" title="My Linkedin account" className="text-white hover:text-gray-400 text-sm block py-1 px-3"> <FontAwesomeIcon icon={faTwitter} /> </a> </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

    </Fragment>
  );
};

export default HomePage;
