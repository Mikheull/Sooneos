import { Fragment } from 'react';
import Meta from '@/components/Meta';

const AuthLayout: React.FC = ({ children }) => {
  return (
    <Fragment>
      <Meta description="Welcome to Sooneos. Login with your spotify account and get your lyrics in real time !" />
      <main className="flex flex-col justify-center h-screen items-center max-w-screen-2xl mx-auto">
        {children}
      </main>
    </Fragment>
  );
};

export default AuthLayout;
