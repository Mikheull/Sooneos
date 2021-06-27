import Button from '@/components/Button';
import AuthLayout from '@/layouts/AuthLayout';
import { CustomPage } from '@/models/CustomPage';
import { signIn, useSession } from 'next-auth/client';
import {
  NoPageFlicker,
  NO_PAGE_FLICKER_CLASSNAME,
} from '@/components/NoPageFlicker';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Login: CustomPage = () => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && !loading) {
      document.documentElement.classList.add(NO_PAGE_FLICKER_CLASSNAME);
    } else {
      router.replace('/');
    }
  }, [session, router, loading]);

  const banner = {
    backgroundImage: "url('/static/images/login.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  }

  
  return (
    <AuthLayout>
      <NoPageFlicker />

      <div className="flex flex-col items-center flex-1 h-full px-4 sm:px-0">
        <div className="flex w-screen sm:mx-0">

          <div className="flex flex-col w-full md:w-2/5 p-4 h-screen">
            <div className="flex flex-col flex-1 justify-center mb-8 md:px-20 sm:px-0">
              <h1 className="text-4xl text-gray-900 font-bold">Login</h1>
              <h2 className="text-1xl text-gray-700">Link your Spotify account to sing !</h2>

              <div className="mt-4">
                <Button
                  variant="login"
                  buttonSize="small"
                  onClick={() => signIn('spotify', { callbackUrl: '/' })}
                >
                  <FontAwesomeIcon icon={faSpotify} /> Connect now
                </Button>
              </div>
            </div>
          </div>


          <div className="hidden md:block md:w-3/5 h-screen" style={banner}></div>

        </div>
    </div>
    </AuthLayout>
  );
  
};

export default Login;

