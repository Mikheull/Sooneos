import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Meta from '@/components/Meta';

const HomeLayout: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <Fragment>
      <Meta description="Welcome to Sooneos. Login with your spotify account and get your lyrics in real time !" />

      <main className="">
        {children}
      </main>
    </Fragment>
  );
};


export default HomeLayout;

