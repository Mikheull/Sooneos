import { SpotifyProfile } from '@/models/Spotify';
import { Fragment, useState } from 'react'
import Link from 'next/link';
import classnames from 'classnames';
import { RoutePath } from '@/models/RoutePath.enum';
import { signOut } from 'next-auth/client';
import Image from 'next/image';

import { Menu, Dialog, Transition } from '@headlessui/react'

import { faSignOutAlt, faCaretDown, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface Props {
  isLoading: boolean;
  profile: SpotifyProfile;
}

const HomeHeader: React.FC<Props> = ({
  isLoading,
  profile
}) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <header
      className={classnames('', {
        'animate-pulse': isLoading,
      })}
    >
      {isLoading ? (
        <Fragment>
          <div className="rounded-full bg-gray-600 h-40 w-40 mb-6" />
          <div className=" bg-gray-600 w-7/12 md:w-60 h-7 md:h-11 rounded mb-6" />
          <div className=" bg-gray-600 w-9/12 md:w-96 h-11 rounded mb-10" />
          <div className=" bg-gray-600 w-3/12 md:w-20 h-11 rounded mb-6" />
        </Fragment>
      ) : (
        
        <Fragment>
          <nav className="border-b border-gray-200">
            <div className="px-6 mx-auto lg:px-16">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href={RoutePath.HOME}>
                    <a className="flex items-center">
                      <div className="font-semibold text-gray-700 text-lg">
                        <img src="/static/icons/logo.svg" alt="The Sooneos logo" className="w-16" />
                      </div>
                    </a>
                  </Link>
                </div>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center max-w-xs text-sm text-gray-800 rounded-full focus:outline-none focus:shadow-solid">
                      <p className="text-gray-700 mr-4">{profile.display_name} <FontAwesomeIcon icon={faCaretDown} /></p>
                      {profile.images.length ? (
                        <Image
                          src={profile.images[0].url}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <img className="w-8 h-8 rounded-full" src="https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png" alt="Spotify profil pic" />
                      )}
                    </Menu.Button>

                  </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          <a onClick={openModal} className="cursor-pointer flex flex-row items-center px-4 py-2 text-sm text-gray-700 focus:text-gray-900 hover:text-gray-900 focus:outline-none hover:bg-gray-100 focus:bg-gray-100">
                            <FontAwesomeIcon icon={faQuestionCircle} />
                            <span className="ml-2">Help</span>
                          </a>
                        </Menu.Item>

                        <Menu.Item>
                          <a href="https://www.spotify.com/fr/account/apps/" target="blank" className="flex flex-row items-center px-4 py-2 text-sm text-gray-700 focus:text-gray-900 hover:text-gray-900 focus:outline-none hover:bg-gray-100 focus:bg-gray-100">
                            <FontAwesomeIcon icon={faSpotify} />
                            <span className="ml-2">Spotify Account</span>
                          </a>
                        </Menu.Item>
                        <Menu.Item>
                          <a onClick={() => signOut()} className="cursor-pointer flex flex-row items-center px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-100 focus:outline-none focus:text-red-700 focus:bg-red-100">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span className="ml-2">Sign out</span>
                          </a>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </nav>

          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={closeModal}
            >
              <div className="min-h-screen px-4 text-center bg-black bg-opacity-75">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="inline-block h-screen align-middle"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title as="h3" className="font-semibold text-3xl leading-6 text-lyrics-600" >
                      About Sooneos
                    </Dialog.Title>

                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                          <p className="mb-2">Have you ever wanted to sing a song but you couldn’t find the lyrics quickly ? With Sooneos, simply launch any song on your Spotify account (free and premium) and get the lyrics automatically on this page</p>
                          <p className="mb-2">The algorithm searches the lyrics, thanks to the title and the artists of the songs, on the website <a href="https://genius.com" target="blank" className="text-lyrics-700 hover:text-lyrics-500 underline">Genius</a>. If no lyrics are found (this is possible for lesser known songs and not available on <a href="https://genius.com" target="blank" className="text-lyrics-700 hover:text-lyrics-500 underline">Genius</a>) you will get an error notification</p>
                          <p className="mb-2">Sooneos detect when you change music and the lyrics will update automatically.</p>
                      </div>

                      <h2 className="text-gray-700 font-semibold text-3xl pt-6">Privacy</h2>
                      <div className="text-sm text-gray-500">
                          <p className="mb-4">To use Sooneos, you must link your Spotify account to the application (necessary to know the music you listen in real time). We do not store any personal data.</p>
                          <p className="mb-4 text-gray-800 font-medium underline">Here is a list of required scopes and their use :</p>
                          <ul className="mb-4">
                              <li className="flex"><span className="font-medium text-lyrics-700"><i className="fa fa-caret-right"></i> basic</span> <span className="italic text-gray-600 ml-2">Access to your accound data (for login)</span> </li>
                              <li className="flex"><span className="font-medium text-lyrics-700"><i className="fa fa-caret-right"></i> <a href="https://developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/" target="blank">user-read-currently-playing</a></span> <span className="italic text-gray-600 ml-2">Get your currently music</span> </li>
                          </ul>
                          <p className="mb-4">If you are logged in with a wrong account or want to log out of the application click <a onClick={() => signOut()} className="text-red-700 hover:text-red-500 underline cursor-pointer">here</a>. You can also remove Sooneos access to your Spotify account by clicking <a href="https://www.spotify.com/fr/account/apps/" target="blank" className="text-red-700 hover:text-red-500 underline">here</a>.</p>
                      </div>

                      <h2 className="text-gray-700 font-semibold text-3xl pt-6">Discover</h2>
                      <div className="text-sm text-gray-500">
                          <p className="mb-2">Sooneos is an <a href="https://github.com/Mikheull/Sooneos" target="blank" className="text-lyrics-700 hover:text-lyrics-500 underline">open-source</a> project developed in NextJS with the <a href="https://developer.spotify.com/documentation/web-api/" target="blank" className="text-lyrics-700 hover:text-lyrics-500 underline">Spotify API</a>.</p>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-lyrics-900 bg-lyrics-100 border border-transparent rounded-md hover:bg-lyrics-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={closeModal}>
                          Got it, thanks!
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>

        </Fragment>
      )}
    </header>
  );
};

export default HomeHeader;
